"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SessionSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        required: true
    },
    sessionNumber: {
        type: Number,
        required: true
    },
});
module.exports = mongoose_1.default.model('Session', SessionSchema);
