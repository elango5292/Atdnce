"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markPresent = void 0;
const AttendanceModel = require("../models/attendance.model");
const SessionModel = require("../models/session.model");
const UserModel = require("../models/user.model");
const axios = require("axios");
const FormData = require("form-data");
require('dotenv').config();
const orionApiKey = process.env.ORION_API_KEY;
const orionUrl = process.env.ORION_END_POINT;
const uuid = require("uuid");
const fs = require("fs");
const { timeStamp } = require("console");
const searchFace = (image) => __awaiter(void 0, void 0, void 0, function* () {
    const newImg = image.split(";base64,").pop();
    if (!newImg) {
        console.log("no image");
        throw new Error("Image not found");
    }
    const buffer = Buffer.from(newImg, "base64");
    const transactionId = uuid.v4();
    const filename = `image_${transactionId}.jpg`;
    fs.writeFileSync(filename, buffer);
    const fileInp = fs.createReadStream(filename);
    const formData = new FormData();
    formData.append("transactionId", transactionId);
    formData.append("selfie", fileInp);
    let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: orionUrl,
        headers: Object.assign({ "x-api-key": orionApiKey }, formData.getHeaders()),
        data: formData,
    };
    const response = yield axios.request(config);
    const result = response.data;
    fs.unlinkSync(filename);
    return result;
});
const markPresent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image } = req.body;
    if (!image) {
        return res.status(400).json({
            status: "error",
            message: "Missing parameters!",
        });
    }
    try {
        const result = yield searchFace(image);
        if (!result || result.statusCode !== 200 || !result.result || !result.result.data || !result.result.data.matches || !result.result.data.matches.internal.length) {
            return res.status(400).json({
                status: "error",
                message: "Face not found in database or incomplete data received",
            });
        }
        let employee, imgUrl = "";
        for (const match of result.result.data.matches.internal) {
            if (match && match.transactionId) {
                employee = yield UserModel.findOne({ employeeId: match.transactionId });
                if (employee) {
                    imgUrl = match.selfie ? match.selfie.url : "";
                    break;
                }
            }
        }
        if (!employee) {
            return res.status(404).json({
                status: "error",
                message: "Employee not found",
            });
        }
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        console.log("current date", currentDate);
        const session = yield SessionModel.findOne({ date: currentDate });
        if (!session) {
            return res.status(404).json({
                status: "error",
                message: "Session not found",
            });
        }
        const existingAttendance = yield AttendanceModel.findOne({ employeeId: employee.employeeId, sessionId: session._id, sessionNumber: new Date().getHours() < 9 ? 1 : new Date().getHours() < 18 ? 2 : 3 });
        if (existingAttendance && (existingAttendance.status === "present" || existingAttendance.status === "late")) {
            return res.status(400).json({
                status: "error",
                message: "Attendance already marked",
            });
        }
        let presentStatus = "present";
        const currentTime = new Date();
        yield AttendanceModel.updateOne({ employeeId: employee.employeeId, sessionId: session._id, sessionNumber: session.sessionNumber }, { $set: { status: presentStatus, timeStamp: currentTime } });
        res.status(200).json({
            status: "success",
            data: {
                message: `${employee.name} marked as ${presentStatus}`,
                imgUrl: imgUrl,
            },
        });
    }
    catch (error) {
        console.log("-----Error in markPresent: ", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
});
exports.markPresent = markPresent;
