const request = require('supertest');
const app = require('../app'); 
const UserModel = require('../models/user.model');
const SessionModel = require('../models/session.model');
const AttendanceModel = require('../models/attendance.model');
const axios = require('axios');
const fs = require('fs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

jest.mock('axios');
jest.mock('fs');
jest.mock('../models/user.model');
jest.mock('../models/session.model');
jest.mock('../models/attendance.model');

describe('UserController Tests', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe('login function', () => {
        // Tests for missing email or password
        it('should return error if email or password is missing', async () => {
            const response = await request(app).post('/api/v1/users/login').send({ email: 'test@example.com' });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                status: "error",
                message: "Missing parameters",
            });
        });

        // Tests for user not found
        it('should error if user is not found', async () => {
            UserModel.findOne.mockResolvedValue(null);
            const response = await request(app).post('/api/v1/users/login').send({ email: 'nonexistent@example.com', password: 'password' });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                status: "error",
                message: "User not found",
            });
        });

        // Tests for incorrect password
        it('should error if password is incorrect', async () => {
            UserModel.findOne.mockResolvedValue({ email: 'test@example.com', password: 'password123' });
            const response = await request(app).post('/api/v1/users/login').send({ email: 'test@example.com', password: 'wrongpassword' });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                status: "error",
                message: "Invalid password",
            });
        });

        // Tests for successful login
        it('should login successfully with correct credentials', async () => {
            UserModel.findOne.mockResolvedValue({ email: 'test@example.com', password: 'password' });
            const response = await request(app).post('/api/v1/users/login').send({ email: 'test@example.com', password: 'password' });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                status: "success",
            });
        });
    });

    describe('markPresent function', () => {
        // Test successful marking of attendance
        it('should handle face search and mark attendance correctly', async () => {
            const mockImage = 'data:image/png;base64,...';
            axios.request.mockResolvedValue({
                data: {
                    statusCode: 200,
                    result: {
                        data: {
                            matches: {
                                internal: [{ transactionId: '123', selfie: { url: 'http://example.com/photo.jpg' } }]
                            }
                        }
                    }
                }
            });
            UserModel.findOne.mockResolvedValue({ employeeId: '123', name: 'John Doe' });
            SessionModel.findOne.mockResolvedValue({ _id: 'session123', date: new Date(), timeTillPresent: new Date() });
            AttendanceModel.findOne.mockResolvedValue(null);
            AttendanceModel.updateOne.mockResolvedValue({});

            const response = await request(app).post('/api/v1/users/markPresent').send({ image: mockImage });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                status: "success",
                data: {
                    message: "John Doe marked as present",
                    imgUrl: 'http://example.com/photo.jpg',
                },
            });
        });

        // Test error when no session is found
        it('should return error when no session is found on the current date', async () => {
            const mockImage = 'data:image/png;base64,...';
            axios.request.mockResolvedValue({
                data: {
                    statusCode: 200,
                    result: {
                        data: {
                            matches: {
                                internal: [{ transactionId: '123', selfie: { url: 'http://example.com/photo.jpg' } }]
                            }
                        }
                    }
                }
            });
            UserModel.findOne.mockResolvedValue({ employeeId: '123', name: 'John Doe' });
            SessionModel.findOne.mockResolvedValue(null);

            const response = await request(app).post('/api/v1/users/markPresent').send({ image: mockImage });
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                status: "error",
                message: "Session not found",
            });
        });

        // Test error when attendance has already been marked
        it('should return error when attendance is already marked', async () => {
            const mockImage = 'data:image/png;base64,...';
            axios.request.mockResolvedValue({
                data: {
                    statusCode: 200,
                    result: {
                        data: {
                            matches: {
                                internal: [{ transactionId: '123', selfie: { url: 'http://example.com/photo.jpg' } }]
                            }
                        }
                    }
                }
            });
            UserModel.findOne.mockResolvedValue({ employeeId: '123', name: 'John Doe' });
            SessionModel.findOne.mockResolvedValue({ _id: 'session123', date: new Date(), timeTillPresent: new Date() });
            AttendanceModel.findOne.mockResolvedValue({ status: 'present' });  // Attendance already marked as present

            const response = await request(app).post('/api/v1/users/markPresent').send({ image: mockImage });
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                status: "error",
                message: "Attendance already marked",
            });
        });
    });
});
