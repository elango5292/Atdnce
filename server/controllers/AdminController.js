const AdminModel = require("../models/admin.model");
const SessionModel = require("../models/session.model");
const UserModel = require("../models/user.model");
const AttendanceModel = require("../models/attendance.model");
require('dotenv').config();
const orionUrl = "https://c6qxu8f6p2.execute-api.ap-south-1.amazonaws.com/api/searchFace"
const orionApiKey = "UCmVBuJN9s9Bms07DZvrY1ZKt69DUOYd4jH7pbSG"


const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");
const uuid = require("uuid");

const createEmployee = async (req, res) => {
    try {
        const { employeeName, employeeId, gender, image, role } = req.body;

        // Log incoming data for debugging
        console.log("Received data:", { employeeName, employeeId, gender, image, role });

        // Check for required fields
        if (!employeeName || !employeeId || !gender || !image || !role) {
            return res.status(400).json({
                status: "error",
                message: "Missing parameters",
            });
        }

        // Check if an employee already exists with the same employeeId
        const oldEmployee = await UserModel.findOne({ employeeId });
        if (oldEmployee) {
            return res.status(400).json({
                status: "error",
                message: "Employee already exists",
            });
        }

        // Write the image to a temporary file
        const filename = `image_${uuid.v4()}.jpg`;
        const newImg = image.split(";base64,").pop();
        const buffer = Buffer.from(newImg, "base64");
        fs.writeFileSync(filename, buffer);

        // Create a FormData object to send via POST
        const fileInp = fs.createReadStream(filename);
        const formData = new FormData();
        formData.append("transactionId", employeeId);
        formData.append("selfie", fileInp);
        formData.append("enroll", "yes");

        // Configuration for the Axios request
        let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: orionUrl,
            headers: {
                "x-api-key": orionApiKey,
                ...formData.getHeaders(),
            },
            data: formData,
        };

        // Sending the request
        const response = await axios.request(config);
        fs.unlinkSync(filename);  // Deleting the file after the request

        if (response.data.statusCode !== 200) {
            let error = response.data.error || "Internal server error";
            return res.status(400).json({
                status: "error",
                message: error,
            });
        }

        // Creating a new user with the validated data
        const newUser = new UserModel({
            name: employeeName,
            employeeId,
            gender,
            role
        });
        await newUser.save();

        return res.status(200).json({
            status: "success",
            message: "User added successfully",
        });
    } catch (error) {
        console.log("Error in adding the User: ", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};
const addSession = async (req, res) => {
    try {
        const { date, sessionNumber } = req.body;

        if (!date || !sessionNumber) {
            return res.status(400).json({
                status: "error",
                message: "Missing parameters: 'date' and 'sessionNumber' are required."
            });
        }

        const sessionDate = new Date(date);
        sessionDate.setHours(0, 0, 0, 0); 

        const existingSession = await SessionModel.findOne({
            date: sessionDate,
            sessionNumber
        });

        if (existingSession) {
            return res.status(400).json({
                status: "error",
                message: "A session with the same date and session number already exists."
            });
        }

        const session = new SessionModel({
            date: sessionDate,
            sessionNumber
        });

        await session.save();

        const employees = await UserModel.find();
        console.log("Found employees:", employees.length);

        const attendanceLogs = employees.map(employee => ({
            employeeId: employee._id, // Correctly using 'employee' from the map function
            date: sessionDate,
            sessionId: session._id, // Correct reference to the session ID
            status: 'absent',
            absentReason: "other"
        }));

        await AttendanceModel.insertMany(attendanceLogs); // Efficient bulk insertion
        console.log("Attendance logs created:", attendanceLogs.length);

        return res.status(200).json({
            status: "success",
            message: "Session added successfully."
        });
    } catch (error) {
        console.error("Error in addSession:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};

const getAttendanceLogs = async (req, res) => {
    try {
        const { date, sessionNumber } = req.query;

        if (!date || !sessionNumber) {
            return res.status(400).json({
                status: "error",
                message: "Missing parameters: 'date' and 'sessionNumber' are required."
            });
        }

        const sessionDate = new Date(date);
        sessionDate.setHours(0, 0, 0, 0);  // This normalizes the date to the beginning of the day

        const attendanceLogs = await AttendanceModel.find({
            date: sessionDate,
            sessionNumber
        });

        return res.status(200).json({
            status: "success",
            message: "Attendance logs retrieved successfully.",
            attendanceLogs
        });
    } catch (error) {
        console.log("Error in getAttendanceLogs: ", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error"
        });
    }
};

module.exports = {createEmployee,addSession,getAttendanceLogs};