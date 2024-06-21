"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AttendanceSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    employeeId: {
        type: String,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    sessionId: {
        type: String,
        ref: "Session",
        required: true,
    },
    status: {
        type: String,
        enum: ["present", "absent", "late"],
        required: true,
    },
    sessionNumber: {
        type: Number,
        required: true,
    },
    absentReason: {
        type: String,
        enum: ["medical", "other"],
        required: true,
    },
});
const AttendanceModel = mongoose_1.default.model("Attendance", AttendanceSchema);
module.exports = AttendanceModel;
