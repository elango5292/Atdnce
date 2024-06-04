const AdminModel = require("../models/admin.model");
const AttendanceModel = require("../models/attendance.model");
const SessionModel = require("../models/session.model");
const UserModel = require("../models/user.model");
require('dotenv').config();
const orionUrl = process.env.orionUrl || "";
const orionApiKey = process.env.orionApiKey || "";


const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");
const uuid = require("uuid");

const createEmployee = async (req,res) =>{
    try{
        const {employeeName,employeeId,gender,image,role} = req.body;

        if(!employeeName || !employeeId || !gender ||!image || !role){
            return res.status(400).json({
                status:"error",
                message: "Missing parameters",
            });
        }
        const oldEmployee = await UserModel.findOne({employeeId});
        if (oldEmployee) {
            return res.status(400).json({
                status : "error",
                message:"Employee already exists",
            });
        }

        const filename = `image_${uuid.v4()}.jpg`;

        //Enroll image to Orion
        const newImg = image.split(":base64").pop();
        const buffer = Buffer.from(newImg,"base64");
        fs.writeFileSync(filename,buffer);

        const fileInp = fs.createReadStream(filename);
        const formData = new FormData();
        formData.append("transactionId",employeeId);
        formData.append("selfie",fileInp);
        formData.append("enroll","yes");

        let config = {
            method:"post",
            maxBodyLength: Infinity,
            url: orionUrl,
            headers: {
                "x-api-key": orionApiKey,
                ...fornData.getHeaders(),
            },
            data: formData,
        };
        const response = await axios.request(config);
        const result = response.data;
        fs.unlinkSync(filename);

        if (result.statusCode !== 200) {
            let error = result.error || "Interval server error";
            return res.status(400).json({
                status: "error",
                message: error,
            });
        }
        const User = new UserModel({
            name,rollNo,gender
        })
        await User.save();

        return res.status(200).json({
            status: "success",
            message: "User added successfully", 
        });
    }catch (error) {
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

        // to ensure it's valid and remove time information if not needed
        const sessionDate = new Date(date);
        sessionDate.setHours(0, 0, 0, 0);  // This normalizes the date to the beginning of the day

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
        console.log(employees);

        // Create attendance logs for each employee with default status 'absent'
        const attendanceLogs = employees.map(employee => new AttendanceModel({
            employeeId: User._id,
            date: sessionDate,
            sessionId: session._id,
            status: 'absent',
            absentReason: "other"
        }));

        // Save all attendance logs
        for (let log of attendanceLogs) {
            await log.save();
        }
        console.log(attendanceLogs);

        return res.status(200).json({
            status: "success",
            message: "Session added successfully."
        });
    } catch (error) {
        console.log("Error in addSession: ", error);
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