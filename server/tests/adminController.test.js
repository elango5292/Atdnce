require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require("../app"); 
const UserModel = require('../models/user.model');
const SessionModel = require('../models/session.model');
const AttendanceModel = require('../models/attendance.model');

// Mocks for dependencies like MongoDB and external services
jest.mock('../models/user.model');
jest.mock('../models/session.model');
jest.mock('../models/attendance.model');

describe('Admin Controller', () => {
    // Before all tests, connect to a test database
    beforeAll(async () => {
        const url = process.env.MONGO_URL;
        await mongoose.connect(url, { useNewUrlParser: true });
    });

    // Clear all test data after every test
    afterEach(async () => {
        jest.resetAllMocks(); // Reset mocks to avoid leakage between tests
        await mongoose.connection.db.dropDatabase();
    });

    // After all tests are done, disconnect from the database
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('POST /api/v1/admin/employee', () => {
        it('should create an employee successfully', async () => {
            UserModel.findOne.mockResolvedValue(null); // Mock findOne to simulate no existing user
            UserModel.save.mockResolvedValue({}); // Mock save to simulate saving user

            const response = await request(app)
                .post('/api/v1/admin/employee')
                .send({
                    employeeName: 'John Doe',
                    employeeId: '123',
                    gender: 'Male',
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                    role: 'admin'
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
        });

        it('should return an error if employee already exists', async () => {
            UserModel.findOne.mockResolvedValue(true); // Mock findOne to simulate existing user

            const response = await request(app)
                .post('/api/v1/admin/employee')
                .send({
                    employeeName: 'John Doe',
                    employeeId: '123',
                    gender: 'Male',
                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==',
                    role: 'admin'
                });

            expect(response.status).toBe(400);
            expect(response.body.status).toBe('error');
        });
    });

    describe('POST /api/v1/admin/session', () => {
        it('should add a session successfully', async () => {
            SessionModel.findOne.mockResolvedValue(null); // No existing session
            SessionModel.save.mockResolvedValue({}); // Mock saving session

            const response = await request(app)
                .post('/api/v1/admin/session')
                .send({
                    date: '2024-06-06',
                    sessionNumber: 1
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
        });
    });

    describe('GET /api/v1/admin/attendance', () => {
        it('should retrieve attendance logs', async () => {
            AttendanceModel.find.mockResolvedValue([{ employeeId: '123', sessionId: '456', status: 'present' }]); // Mock find

            const response = await request(app)
                .get('/api/v1/admin/attendance')
                .query({
                    date: '2024-06-06',
                    sessionNumber: 1
                });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.attendanceLogs.length).toBeGreaterThan(0);
        });
    });
});
