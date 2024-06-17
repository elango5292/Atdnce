const AdminController = require('../controllers/AdminController');
const UserModel = require('../models/user.model');
const SessionModel = require('../models/session.model');
const AttendanceModel = require('../models/attendance.model');
const { noemp,yesemp,noses } = require('./imgs');
jest.mock('../models/user.model');
jest.mock('../models/session.model');
jest.mock('../models/attendance.model');

describe('AdminController', () => {
  describe('createEmployee', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          employeeName: 'John Doe',
          employeeId: '123fd456',
          gender: 'male',
          image: noemp,
          role: 'employee',
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 if missing parameters', async () => {
      req.body = {};

      await AdminController.createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Missing parameters',
      });
    });

    it('should return 400 if employee already exists', async () => {
      UserModel.findOne.mockResolvedValue({ employeeId: '123456' });

      await AdminController.createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Employee already exists',
      });
    });

    it('should create a new employee if all parameters are provided', async () => {
      UserModel.findOne.mockResolvedValue(null);
      UserModel.mockImplementation(() => {
        return {
          save: jest.fn(),
        };
      });

      await AdminController.createEmployee(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'User added successfully',
        orion: expect.any(Object),
      });
    });
  });

  describe('addSession', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          date: '2023-06-17',
          sessionNumber: 1,
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 if missing parameters', async () => {
      req.body = {};

      await AdminController.addSession(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: "Missing parameters: 'date' and 'sessionNumber' are required.",
      });
    });

    it('should return 400 if session already exists', async () => {
      SessionModel.findOne.mockResolvedValue({ date: new Date(req.body.date), sessionNumber: req.body.sessionNumber });

      await AdminController.addSession(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'A session with the same date and session number already exists.',
      });
    });

    it('should create a new session and attendance logs if parameters are valid', async () => {
      SessionModel.findOne.mockResolvedValue(null);
      UserModel.find.mockResolvedValue([{ name: 'John Doe', gender: 'male', employeeId: '123456', role: 'employee' }]);
      SessionModel.mockImplementation(() => {
        return {
          save: jest.fn(),
        };
      });
      AttendanceModel.mockImplementation(() => {
        return {
          save: jest.fn(),
        };
      });

      await AdminController.addSession(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Session added successfully.',
      });
    });
  });

  describe('getAttendanceLogs', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          date: '2023-06-17',
          sessionNumber: 1,
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 if missing parameters', async () => {
      req.body = {};

      await AdminController.getAttendanceLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: "Missing parameters: 'date' and 'sessionNumber' are required.",
      });
    });

    it('should return attendance logs if parameters are valid', async () => {
      const attendanceLogs = [
        { name: 'John Doe', gender: 'male', employeeId: '123456', date: new Date(req.body.date), sessionNumber: req.body.sessionNumber },
      ];
      AttendanceModel.find.mockResolvedValue(attendanceLogs);

      await AdminController.getAttendanceLogs(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Attendance logs retrieved successfully.',
        attendanceLogs,
      });
    });
  });

  describe('getSessions', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          month: 6,
          year: 2023,
        },
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 if missing parameters', async () => {
      req.body = {};

      await AdminController.getSessions(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: "Missing parameters: 'month' and 'year' are required.",
      });
    });

    it('should return sessions if parameters are valid', async () => {
      const sessions = [
        { date: new Date('2023-06-01'), sessionNumber: 1 },
        { date: new Date('2023-06-02'), sessionNumber: 2 },
      ];
      SessionModel.find.mockResolvedValue(sessions);

      await AdminController.getSessions(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: sessions,
      });
    });
  });

  describe('createSessions', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          from: '2023-06-15',
          to: '2023-06-20',
sessionNumber: 1,
action: 'add',
},
};
res = {
status: jest.fn().mockReturnThis(),
json: jest.fn(),
};
});afterEach(() => {
  jest.clearAllMocks();
});

it('should return 400 if missing parameters', async () => {
  req.body = {};

  await AdminController.createSessions(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({
    status: 'error',
    message: "Missing parameters: 'from', 'to', 'sessionNumber', and 'action' are required.",
  });
});

it('should add sessions for the given date range and session number', async () => {
  const addSessionWorkerMock = jest.spyOn(AdminController, 'addSessionWorker');

  await AdminController.createSessions(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    status: 'success',
    message: 'Sessions processed successfully.',
  });

  addSessionWorkerMock.mockRestore();
});

it('should delete sessions for the given date range and session number', async () => {
  req.body.action = 'delete';
  const deleteSessionMock = jest.spyOn(AdminController, 'deleteSession');

  await AdminController.createSessions(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    status: 'success',
    message: 'Sessions processed successfully.',
  });

  deleteSessionMock.mockRestore();
});
});
});