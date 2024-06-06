const AttendanceModel = require("../models/attendance.model");
const SessionModel = require("../models/session.model");
const UserModel = require("../models/user.model");
const axios = require("axios");
const FormData = require("form-data");
require('dotenv').config();
// const orionApiKey = process.env.ORION_API_KEY || "";
// const orionUrl = process.env.ORION_END_POINT || "";
const orionUrl = "https://c6qxu8f6p2.execute-api.ap-south-1.amazonaws.com/api/searchFace"
const orionApiKey = "UCmVBuJN9s9Bms07DZvrY1ZKt69DUOYd4jH7pbSG"
const uuid = require("uuid");
const fs = require("fs");
const { timeStamp } = require("console");


const login = async (req,res) =>{
    const {email,password} = req.body;
    // console.log(email,password)
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

// const searchFace = async (image) => {
//     const newImg = image.split(";base64,").pop();
//     const buffer = Buffer.from(newImg, "base64");

//     const transactionId = uuid.v4();
//     const filename = `image_${transactionId}.jpg`;
//     fs.writeFileSync(filename, buffer);

//     const fileInp = fs.createReadStream(filename);
//     const formData = new FormData();
//     formData.append("transactionId", transactionId);
//     formData.append("selfie", fileInp);

//     let config = {
//         method: "post",
//         maxBodyLength: Infinity,
//         url: orionUrl,
//         headers: {
//             "x-api-key": orionApiKey,
//             ...formData.getHeaders(),
//         },
//         data: formData,
//     };
//     const response = await axios.request(config);
//     const result = response.data;

//     fs.unlinkSync(filename);

//     return result;
// };
// ----------------------------------------------------------------------------------------


const searchFace = async (image) => {
    const transactionId = uuid.v4();
    const filename = `image_${transactionId}.jpg`;
    const buffer = Buffer.from(image.split(";base64,").pop(), "base64");
    fs.writeFileSync(filename, buffer);

    const formData = new FormData();
    formData.append("transactionId", transactionId);
    formData.append("selfie", fs.createReadStream(filename));

    const config = {
        method: "post",
        url:  orionUrl, // replace with your actual API URL
        headers: {
            "x-api-key": orionApiKey, // replace with your actual API key
            ...formData.getHeaders(),
        },
        data: formData,
    };

    try {
        const response = await axios(config);
        fs.unlinkSync(filename); // clean up file after sending
        return response.data; // ensure that this matches the structure you expect
    } catch (error) {
        fs.unlinkSync(filename); // clean up file on error
        console.error("searchFace Error:", error);
        return null; // or return a structure that indicates failure
    }
};
//  to mark present
// const markPresent = async (req,res) =>{
//     const { image } = req.body;

//     const date = new Date();
//     date.setHours(date.getHours() + 5);
//     date.setMinutes(date.getMinutes() + 30);

//     console.log(date)

//     const currentDate= new Date(date);
//     currentDate.setHours(0 + 5);
//     currentDate.setMinutes(0 + 30);
//     currentDate.setSeconds(0);
//     currentDate.setMilliseconds(0);
//     const _timestamp = new Date(date);

//     //set GMT

//     if(!image) {
//         return res.status(400).json({
//             status : "error",
//             message: "Missing parameters !",
//         });
//     }
//     try {

//         //to Search Image
//         const result  = await searchFace(image);

//         if(result.statusCode !== 200){
//             return res.status(400).json({
//                 status: "error",
//                 message: "Face not found in database",
//             });
//         }
//         let rollNo = result.result.data.matches.internal[0].transactionId;
//         if(!rollNo) {
//             return res.status(400).json({
//                 status: "error",
//                 message : "Face not found in database",
//             });
//         }

//         const it = result.result.data.matches.internal;
//         let employee = undefined,
//             employeeFound = false,
//             imgUrl = "";

//         for (let i = 0; i < it.length; i++) {
//             rollNo = it[i].transactionId;
//             employee = await UserModel.findOne({ rollNo });
//             if (employee) {
//                 employeeFound = true;
//                 imgUrl = it[i].selfie.url;
//                 break;
//             }
//         }
//         const session = await SessionModel.findOne({currentDate});
//         if(!session) {
//             return res.status(404).json({
//                 status: "error",
//                 message : "Session not found",
//             });
//         }
//         let presentStatus = "late";
//         if (_timestamp <= session.timeTillPresent) presentStatus = "present";

//         //return back if already marked present or late

//         const check = await AttendanceModel.findOne({
//             employeeId : UserModel._id,
//             sessionId : SessionModel._id
//         });
//         if(check.presentStatus === "present" || check.presentStatus === "late"){
//             return res.status(400).json({
//                 status:"error",
//                 message:"Already marked",
//             });
//         }

//         await AttendanceModel.updateOne(
//             {employeeId : UserModel._id,sessionId:SessionModel._id},
//             { $set : { status : presentStatus,timeStamp : _timestamp}}
//         );
//         res.status(200).json({
//             status:"success",
//             data: {
//                 message:`${UserModel.name} Marked as ${presentStatus}`,
//                 imgUrl: imgUrl,
//             },
//         });

//     }catch(error){
//         console.log("Error in markPresent: ", error);
        
//         return res.status(500).json({
//             status:"error",
//             message:"Internal Server Error",
//         });
//     }

// };

// ------------------------------------------------------------------------------------------------------ 
// const markPresent = async (req, res) => {
//     const { image } = req.body;

//     if (!image) {
//         return res.status(400).json({
//             status: "error",
//             message: "Missing image parameter!",
//         });
//     }

//     try {
//         // Attempt to search the face in the image
//         const result = await searchFace(image);
        
//         // Check if the search was successful
//         if (result.statusCode !== 200 || !result.result || !result.result.data || !result.result.data.matches || !result.result.data.matches.internal || !result.result.data.matches.internal.length) {
//             return res.status(400).json({
//                 status: "error",
//                 message: "Face not found in database",
//             });
//         }

//         // Assuming there's at least one match, proceed
//         const matches = result.result.data.matches.internal;
//         let employeeFound = false;
//         let employee, imgUrl;

//         // Iterate over matches to find a valid employee
//         for (let match of matches) {
//             employee = await UserModel.findOne({ employeeId: match.transactionId });
//             if (employee) {
//                 employeeFound = true;
//                 imgUrl = match.selfie.url;
//                 break;
//             }
//         }

//         if (!employeeFound) {
//             return res.status(404).json({
//                 status: "error",
//                 message: "Employee not found in database",
//             });
//         }

//         // Find the session for today
//         const currentDate = new Date();
//         currentDate.setHours(0, 0, 0, 0);
//         const session = await SessionModel.findOne({ date: currentDate });
//         if (!session) {
//             return res.status(404).json({
//                 status: "error",
//                 message: "Session not found",
//             });
//         }

//         // Check if already marked present or late
//         const attendanceRecord = await AttendanceModel.findOne({ employeeId: employee._id, sessionId: session._id });
//         if (attendanceRecord && (attendanceRecord.status === "present" || attendanceRecord.status === "late")) {
//             return res.status(400).json({
//                 status: "error",
//                 message: "Already marked",
//             });
//         }

//         // Determine present status
//         const now = new Date();
//         let presentStatus = "late";
//         if (now <= session.timeTillPresent) {
//             presentStatus = "present";
//         }

//         // Update or create attendance record
//         await AttendanceModel.updateOne(
//             { employeeId: employee._id, sessionId: session._id },
//             { $set: { status: presentStatus, timeStamp: now } },
//             { upsert: true }
//         );

//         res.status(200).json({
//             status: "success",
//             data: {
//                 message: `${employee.name} marked as ${presentStatus}`,
//                 imgUrl: imgUrl,
//             },
//         });

//     } catch (error) {
//         console.error("Error in markPresent: ", error);
//         return res.status(500).json({
//             status: "error",
//             message: "Internal Server Error",
//         });
//     }
// };

// ------------------------------------------------------------------------------------------------------

const markPresent = async (req,res) =>{
    const { image } = req.body;

    const date = new Date();
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    console.log(date)

    const currentDate= new Date(date);
    currentDate.setHours(0 + 5);
    currentDate.setMinutes(0 + 30);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
    const _timestamp = new Date(date);

    //set GMT

    if(!image) {
        return res.status(400).json({
            status : "error",
            message: "Missing parameters !",
        });
    }
    try {

        //to Search Image
        const result  = await searchFace(image);
        console.log(result);
        if(result.statusCode !== 200){
            return res.status(400).json({
                status: "error",
                message: "Face not found in database",
            });
        }
        let rollNo = result.result.data.matches.internal[0].transactionId;
        console.log(rollNo);
        if(!rollNo) {
            return res.status(400).json({
                status: "error",
                message : "Face not found in database",
            });
        }

        const it = result.result.data.matches.internal;
        let employee = undefined,
            employeeFound = false,
            imgUrl = "";

        for (let i = 0; i < it.length; i++) {
            rollNo = it[i].transactionId;
            employee = await UserModel.findOne({ rollNo });
            if (employee) {
                employeeFound = true;
                imgUrl = it[i].selfie.url;
                break;
            }
        }
        const session = await SessionModel.findOne({date:"2024-06-05T18:30:00.000+00:00"});
        if(!session) {
            return res.status(404).json({
                status: "error",
                message : "Session not found",
            });
        }
        let presentStatus = "late";
        if (_timestamp <= session.timeTillPresent) presentStatus = "present";

        //return back if already marked present or late

        const check = await AttendanceModel.findOne({
            employeeId : UserModel._id,
            sessionId : SessionModel._id
        });
        if(check.presentStatus === "present" || check.presentStatus === "late"){
            return res.status(400).json({
                status:"error",
                message:"Already marked",
            });
        }

        await AttendanceModel.updateOne(
            {employeeId : UserModel._id,sessionId:SessionModel._id},
            { $set : { status : presentStatus,timeStamp : _timestamp}}
        );
        res.status(200).json({
            status:"success",
            data: {
                message:`${UserModel.name} Marked as ${presentStatus}`,
                imgUrl: imgUrl,
            },
        });

    }catch(error){
        console.log("Error in markPresent: ", error);
        
        return res.status(500).json({
            status:"error",
            message:"Internal Server Error",
        });
    }

};

module.exports = {login,markPresent};