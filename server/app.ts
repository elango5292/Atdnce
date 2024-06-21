require('dotenv').config();

import express from "express";
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');
import { Response,Request } from "express";



app.use((req, res, next) => {
    console.log("path", req.path, " method", req.method);
    next();
});

const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json());
app.use(cookieParser());

// Routes
const UserRoutes = require('./routes/UserRoutes.js');
const AdminRoutes = require('./routes/AdminRoutes.js');


app.use("/api/v1/users",UserRoutes);
app.use("/api/v1/admin",AdminRoutes);

app.use(express.json({ limit: "10mb" }));

app.use((err: any, req:Request, res:Response, next:any) => {
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
    }).catch((error: any) => {
        console.log("MongoDB connection error:", error);
    });

