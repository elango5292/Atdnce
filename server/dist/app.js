"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const mongoose = require('mongoose');
const app = (0, express_1.default)();
const cookieParser = require('cookie-parser');
app.use((req, res, next) => {
    console.log("path", req.path, " method", req.method);
    next();
});
const cors = require('cors');
const PORT = process.env.PORT || 3000;
app.use(cors({
    origin: "*",
}));
app.use(express_1.default.json());
app.use(cookieParser());
// Routes
const UserRoutes = require('./routes/UserRoutes.js');
const AdminRoutes = require('./routes/AdminRoutes.js');
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.use(express_1.default.json({ limit: "10mb" }));
app.use((err, req, res, next) => {
    if (err) {
        console.log(err.stack);
        return res
            .status(400)
            .json({ status: "error", message: "Invalid JSON payload" });
    }
    next();
});
module.exports = app;
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`MongoDB connected successfully and server listening on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log("MongoDB connection error:", error);
});
