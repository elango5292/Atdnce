const request = require('supertest');
const app = require('../app'); 
const UserModel = require('../models/user.model');
const SessionModel = require('../models/session.model');
const AttendanceModel = require('../models/attendance.model');
const axios = require('axios');
const fs = require('fs');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');


describe('userControllerTests', () => {
    // Before all tests, connect to a test database
    beforeAll(async () => {
        const url = process.env.MONGO_URL;
        await mongoose.connect(url, { useNewUrlParser: true });
    });


    afterEach(async () => {
        await mongoose.connection.close();
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
