const mongoose = require("mongoose")
const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    ref:"User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  sessionId: {
    type: String,
    ref:"Session",
    required: true,
  },
  status:{
    type: String,
    enum: ["present", "absent","late"],
    required: true,
  },
  absentReason:{
    type: String,
    enum:["medical","other"],
    required: true,
  },
});
const AttendanceModel = mongoose.model("Attendance", AttendanceSchema);
module.exports = AttendanceModel;