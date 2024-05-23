const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

const AttendanceSchema = new mongoose.Schema({
    userID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    date: { 
        type: Date,
        default: Date.now 
    },
  },{
    timestamps: true
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    keyImage: {
        type: String, //Base64-encoded image
        required: true,
    },
    attendance: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendance',
    }],
});

const Admin = mongoose.model('Admin',AdminSchema);
const User = mongoose.model('User',UserSchema);
const Attendance = mongoose.model('Attendance',AttendanceSchema);

module.exports = {
    Admin,
    User,
    Attendance
}

