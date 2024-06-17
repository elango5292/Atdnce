const userController = require('../controllers/UserController');
const UserModel = require('../models/user.model');
const SessionModel = require('../models/session.model');
const AttendanceModel = require('../models/attendance.model');
const { noemp,yesemp,noses } = require('./imgs');

jest.mock('../models/user.model');
jest.mock('../models/session.model');
jest.mock('../models/attendance.model');
jest.mock('../controllers/UserController', () => ({
  ...jest.requireActual('../controllers/UserController'),
  searchFace: jest.fn(),
}));

describe('User Controller', () => {
  describe('markPresent', () => {
    beforeEach(() => {
      userController.searchFace.mockReset();
    });

    it('should return 400 status if image is missing', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await userController.markPresent(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Missing parameters!',
      });
    });

    it('should return 500 status if face not found or incomplete data received', async () => {
      const req = { body: { image: noemp } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      userController.searchFace.mockResolvedValueOnce({
        statusCode: 200,
        result: {
          data: {
            matches: {
              internal: [],
            },
          },
        },
      });
      await userController.markPresent(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Face not found in database or incomplete data received',
      });
    });

    it('should return 400 status if employee not found', async () => {
      const req = { body: { image: noemp } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      userController.searchFace.mockResolvedValueOnce({
        statusCode: 200,
        result: {
          data: {
            matches: {
              internal: [{ transactionId: 'employeeId' }],
            },
          },
        },
      });
      UserModel.findOne.mockResolvedValueOnce(null);
      await userController.markPresent(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Face not found in database or incomplete data received',
      });
    });

    it('should return 404 status if session not found', async () => {
      const req = { body: { image: noses } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      userController.searchFace.mockResolvedValueOnce({
        statusCode: 200,
        result: {
          data: {
            matches: {
              internal: [{ transactionId: 'employeeId', selfie: { url: noses } }],
            },
          },
        },
      });
      const employee = { employeeId: 'employeeId', name: 'John Doe' };
      UserModel.findOne.mockResolvedValueOnce(employee);
      SessionModel.findOne.mockResolvedValueOnce(null);
      await userController.markPresent(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Employee not found',
      });
    });

    it('should return 400 status if attendance already marked as present', async () => {
      const req = { body: { image: yesemp } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      userController.searchFace.mockResolvedValueOnce({
        statusCode: 200,
        result: {
          data: {
            matches: {
              internal: [{ transactionId: 'employeeId', selfie: { url: 'http://example.com/image.jpg' } }],
            },
          },
        },
      });
      const employee = { employeeId: 'employeeId', name: 'John Doe' };
      const session = { _id: 'sessionId', sessionNumber: 1 };
      const existingAttendance = { status: 'present' };
      UserModel.findOne.mockResolvedValueOnce(employee);
      SessionModel.findOne.mockResolvedValueOnce(session);
      AttendanceModel.findOne.mockResolvedValueOnce(existingAttendance);
      await userController.markPresent(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Attendance already marked',
      });
    });

    it('should return 200 status and mark attendance as present', async () => {
      const req = { body: { image: yesemp } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      userController.searchFace.mockResolvedValueOnce({
        statusCode: 200,
        result: {
          data: {
            matches: {
              internal: [{ transactionId: 'res', selfie: { url: 'http://example.com/image.jpg' } }],
            },
          },
        },
      });
      const employee = { employeeId: 'res', name: 'Crv' };
      const session = { _id: 'sessionId', sessionNumber: 1 };
      UserModel.findOne.mockResolvedValueOnce(employee);
      SessionModel.findOne.mockResolvedValueOnce(session);
      AttendanceModel.findOne.mockResolvedValueOnce(null);
      AttendanceModel.updateOne = jest.fn();
      await userController.markPresent(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          message: `${employee.name} marked as present`,
          imgUrl: 'http://example.com/image.jpg',
        },
      });
      expect(AttendanceModel.updateOne).toHaveBeenCalledWith(
        { employeeId: employee.employeeId, sessionId: session._id, sessionNumber: session.sessionNumber },
        { $set: { status: 'present', timeStamp: expect.any(Date) } }
      );
    });
  });
});