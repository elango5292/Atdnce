const AdminModel = require("../models/admin.model");
const AttendanceModel = require("../models/attendance.model");
const SessionModel = require("../models/session.model");
const UserModel = require("../models/user.model");
require('dotenv').config();
const orionApiKey = process.env.ORION_API_KEY;
const orionUrl = process.env.ORION_END_POINT;


const FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");
const uuid = require("uuid");
const sessionModel = require("../models/session.model");
console.log(orionUrl,orionApiKey)
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
        formData.append("enrol","yes");

        let config = {
            method:"post",
            maxBodyLength: Infinity,
            url: orionUrl,
            headers: {
                "x-api-key":orionApiKey,
                ...formData.getHeaders(),
            },
            data: formData,
        };

        // console.log("configs",config)
        const response = await axios.request(config);
        const result = response.data;
        console.log("result",result)
        fs.unlinkSync(filename);

        if (result.statusCode !== 200) {
            let error = result.error || "Interval server error";
            return res.status(400).json({
                status: "error",
                message: error,
            });
        }
        const User = new UserModel({
            name:employeeName,employeeId:employeeId,gender:gender
        })
        await User.save();

        return res.status(200).json({
            status: "success",
            message: "User added successfully", 
            orion:result
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

        
        const sessionDate = new Date(date);
        sessionDate.setHours(0, 0, 0, 0);  // This normalizes the date to the beginning of the day
        console.log("sDate",sessionDate)

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
            sessionNumber:sessionNumber
        });

        await session.save();

        const employees = await UserModel.find();
        console.log(employees);

        // Create attendance logs for each employee with default status 'absent'
        const attendanceLogs = employees.map(employee => new AttendanceModel({

            name:employee.name,
            gender:employee.gender,
            employeeId: employee.employeeId,

            date: sessionDate,
            sessionId: session._id,
            role:employee.role,
            status: 'absent',
            absentReason: "other",
            
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
        console.log("----- Error in addSession: ", error);
        return res.status(500).json({
            status: "error",
            message:"Internal Server Error",
        });
    }
};

const getAttendanceLogs = async (req, res) => {
    try {
        const { date, sessionNumber } = req.body;

        if (!date && !sessionNumber) {
            return res.status(400).json({
                status: "error",
                message: "Missing parameters: 'date' and 'sessionNumber' are required."
            });
        }
        console.log("sessiondate",date)

        const sessionDate = new Date(date);
        sessionDate.setHours(0, 0, 0, 0);  // This normalizes the date to the beginning of the day
        console.log("sessiondate",sessionDate)

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
        console.log("---------Error in getAttendanceLogs: ", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};

const getSessions = async (req, res) => {
    try {
        const { month, year } = req.body;
        
            if (!month && !year) {
                return res.status(400).json({
                    status: "error",
                    message: "Missing parameters: 'month' and 'year' are required."
                });
            }
        const startDate = new Date(year, month - 1);
        const endDate = new Date(year, month); 

        const sessions = await SessionModel.find({
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        return res.status(200).json({
            status: "success",
            data: sessions,
        });
    } catch (error) {
        console.log("Error in getSessions: ", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};


const addSessionWorker = async (date, sessionNumber) => {
    try {
        const sessionDate = new Date(date);
        sessionDate.setHours(0, 0, 0, 0);  // This normalizes the date to the beginning of the day

        const existingSession = await SessionModel.findOne({
            date: sessionDate,
            sessionNumber
        });

        if (existingSession) {
            throw new Error("A session with the same date and session number already exists.");
        }

        const session = new SessionModel({
            date: sessionDate,
            sessionNumber
        });

        await session.save();

        const employees = await UserModel.find();

        // Create attendance logs for each employee with default status 'absent'
        const attendanceLogs = employees.map(employee => new AttendanceModel({
            name:employee.name,
            gender:employee.gender,
            employeeId: employee.employeeId,
            date: sessionDate,
            sessionNumber:sessionNumber,
            sessionId: session._id,
            role:employee.role,
            status: 'absent',
            absentReason: "other",
        }));

        // Save all attendance logs
        for (let log of attendanceLogs) {
            await log.save();
        }

        return {
            status: "success",
            message: "Session added successfully."
        };
    } catch (error) {
        console.log("----- Error in addSession: ", error);
        throw error;
    }
};

const deleteSession = async (date, sessionNumber) => {
    try {
        const sessionDate = new Date(date);
        sessionDate.setHours(0, 0, 0, 0);  // This normalizes the date to the beginning of the day

        const existingSession = await SessionModel.findOne({
            date: sessionDate,
            sessionNumber
        });

        if (existingSession) {
            await SessionModel.deleteOne({ _id: existingSession._id });
            // Add additional logic for deleting attendance logs here...
        }

        return {
            status: "success",
            message: "Session deleted successfully."
        };
    } catch (error) {
        console.log("----- Error in deleteSession: ", error);
        throw error;
    }
};

const createSessions = async (req, res) => {
    try {
        const { from, to, sessionNumber, action } = req.body;

        if (!from || !to || !sessionNumber || !action) {
            return res.status(400).json({
                status: "error",
                message: "Missing parameters: 'from', 'to', 'sessionNumber', and 'action' are required."
            });
        }

        const fromDate = new Date(from);
        const toDate = new Date(to);

        for (let d = fromDate; d <= toDate; d.setDate(d.getDate() + 1)) {
            if (action === 'add') {
                await addSessionWorker(d, sessionNumber);
            } else if (action === 'delete') {
                await deleteSession(d, sessionNumber);
            }
        }

        return res.status(200).json({
            status: "success",
            message: "Sessions processed successfully."
        });
    } catch (error) {
        console.log("----- Error in createSessions: ", error);
        return res.status(500).json({
            status: "error",
            message:"Internal Server Error",
        });
    }
};


module.exports = {createEmployee,addSession,getAttendanceLogs,getSessions,createSessions,deleteSession,addSessionWorker};