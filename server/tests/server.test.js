const request = require('supertest');
const mongoose = require('mongoose');
const app = require("../app"); 

// Mock external dependencies
jest.mock('mongoose');

describe('Express Server', () => {
    // Disconnect Mongoose after all tests to prevent open handle
    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('General Middleware Testing', () => {
        test('It should log path and method', async () => {
            const logSpy = jest.spyOn(console, 'log');
            await request(app).get('/api/v1/users/test');
            expect(logSpy).toHaveBeenCalledWith("path", "/api/v1/users/test", " method", "GET");
            logSpy.mockRestore();
        });

        test('It should handle JSON parsing error', async () => {
            const response = await request(app)
                .post('/api/v1/admin/test')
                .send("This is not valid JSON!");
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ status: "error", message: "Invalid JSON payload" });
        });
    });

    describe('CORS and CookieParser Middleware', () => {
        test('It should allow CORS for all origins', async () => {
            const response = await request(app).get('/api/v1/users/test');
            expect(response.headers['access-control-allow-origin']).toBe('*');
        });

        test('It should parse cookies', async () => {
            const cookieValue = 'test=123';
            const response = await request(app)
                .get('/api/v1/users/test')
                .set('Cookie', cookieValue);
            expect(response.headers['set-cookie']).toContain(cookieValue);
        });
    });

    describe('Routing', () => {
        test('It should use UserRoutes for /api/v1/users', async () => {
            // Assuming UserRoutes has specific behavior you can test
        });

        test('It should use AdminRoutes for /api/v1/admin', async () => {
            // Assuming AdminRoutes has specific behavior you can test
        });
    });
});
