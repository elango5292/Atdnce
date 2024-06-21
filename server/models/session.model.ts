import mongoose from "mongoose";
const SessionSchema = new mongoose.Schema({
   date:{
      type: Date,
      required: true
   },
   sessionNumber:{
      type: Number,
      required: true
   },
});



module.exports = mongoose.model('Session', SessionSchema)