
import express from 'express';
const router = express.Router();
const AdminController = require('../controllers/AdminController.js');

router.post('/createEmployee',AdminController.createEmployee);
router.post('/addSession',AdminController.addSession);
router.post('/getAttendanceLogs',AdminController.getAttendanceLogs);
router.post('/getsessions',AdminController.getSessions);
router.post('/createSessions',AdminController.createSessions);

module.exports = router;