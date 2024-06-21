"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const AdminController = require('../controllers/AdminController.js');
router.post('/createEmployee', AdminController.createEmployee);
router.post('/addSession', AdminController.addSession);
router.post('/getAttendanceLogs', AdminController.getAttendanceLogs);
router.post('/getsessions', AdminController.getSessions);
router.post('/createSessions', AdminController.createSessions);
module.exports = router;
