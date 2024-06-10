const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');

router.post('/createEmployee',AdminController.createEmployee);
router.post('/addSession',AdminController.addSession);
router.post('/getAttendanceLogs',AdminController.getAttendanceLogs);

module.exports = router;