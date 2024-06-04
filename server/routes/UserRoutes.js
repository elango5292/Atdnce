const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/UserController");
const userModel = require("../models/user.model");

UserRouter.post("/login", UserController.login);
UserRouter.post("/markPresent", UserController.markPresent);

module.exports = UserRouter;