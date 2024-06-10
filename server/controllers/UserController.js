const AttendanceModel = require("../models/attendance.model");
const SessionModel = require("../models/session.model");
const UserModel = require("../models/user.model");
const axios = require("axios");
const FormData = require("form-data");
require('dotenv').config();
const orionApiKey = process.env.ORION_API_KEY;
const orionUrl = process.env.ORION_URL;

const uuid = require("uuid");
const fs = require("fs");
const { timeStamp } = require("console");


const login = async (req,res) =>{
    const {email,password} = req.body;

    if(!email || !password) {
        return res.status(400).json({
            status :"error",
            message: "Missing parameters",
        });
    }
    const user = await UserModel.findOne({email});

    if(!user){
        return res.status(400).json({
            status :"error",
            message: "User not found",
        });
    }

    if (user.password !== password) {
        return res.status(400).json({
            status: "error",
            message: "Invalid password",
        });
    }
    return res.status(200).json({status:"success"});
};

const searchFace = async (image) => {
    const newImg = image.split(";base64,").pop();
    const buffer = Buffer.from(newImg, "base64");

    const transactionId = uuid.v4();
    const filename = `image_${transactionId}.jpg`;
    fs.writeFileSync(filename, buffer);

    const fileInp = fs.createReadStream(filename);
    const formData = new FormData();
    formData.append("transactionId", transactionId);
    formData.append("selfie", fileInp);

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
    const response = await axios.request(config);
    const result = response.data;

    fs.unlinkSync(filename);

    return result;
};


const markPresent = async (req, res) => {
    const { image } = req.body;

    if (!image) {
        return res.status(400).json({
            status: "error",
            message: "Missing parameters!",
        });
    }

    try {
        const result = await searchFace(image);

        if (!result || result.statusCode !== 200 || !result.result || !result.result.data || !result.result.data.matches || !result.result.data.matches.internal.length) {
            return res.status(400).json({
                status: "error",

                message: "Face not found in database or incomplete data received",


            });
        }

        let employee, imgUrl = "";
        for (const match of result.result.data.matches.internal) {
            if (match && match.transactionId) {
                employee = await UserModel.findOne({ employeeId: match.transactionId });
                if (employee) {
                    imgUrl = match.selfie ? match.selfie.url : "";
                    break;
                }
            }
        }


        if (!employee) {

            return res.status(404).json({
                status: "error",
                message: "Employee not found",
            });
        }

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        console.log("current date",currentDate)

        const session = await SessionModel.findOne({ date: currentDate });
        if (!session) {
            return res.status(404).json({
                status: "error",
                message: "Session not found",
            });
        }

        const existingAttendance = await AttendanceModel.findOne({
            employeeId: employee.employeeId,
            sessionId: session._id
        });

        if (existingAttendance && (existingAttendance.status === "present" || existingAttendance.status === "late")) {
            return res.status(400).json({
                status: "error",
                message: "Attendance already marked",
            });
        }

        let presentStatus = "late";
        const currentTime = new Date();
        if (currentTime <= session.timeTillPresent) {
            presentStatus = "present";
        }

        await AttendanceModel.updateOne(
            { employeeId: employee.employeeId, sessionId: session._id },
            { $set: { status: presentStatus, timeStamp: currentTime } },
            // { upsert: true }
        );

        res.status(200).json({
            status: "success",
            data: {
                message:    `${employee.name} marked as ${presentStatus}`,
                imgUrl: imgUrl,
            },
        });
    } catch (error) {
        console.log("-----Error in markPresent: ", error);
        return res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};

module.exports = {login,markPresent};