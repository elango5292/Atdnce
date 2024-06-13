const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
});

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  userSchema.methods.generateAccessToken = function () {
    let payload = {
      id: this._id,
    };
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  
    console.log(ACCESS_TOKEN_SECRET, "secret");
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "20m",
    });
  };


module.exports = mongoose.model('User', userSchema);