"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRouter = express_1.default.Router();
const UserController_js_1 = require("../controllers/UserController.js");

UserRouter.post("/markPresent", UserController_js_1.markPresent);
module.exports = UserRouter;
