// const express = require("express");
import  express  from "express";
const UserRouter = express.Router();
// import UserRo
// const UserController = require("../controllers/UserController.js");
import { markPresent } from "../controllers/UserController.js";
// const userModel = require("../models/user.model.js");

// UserRouter.post("/login", UserController.login);
UserRouter.post("/markPresent", markPresent);


module.exports = UserRouter