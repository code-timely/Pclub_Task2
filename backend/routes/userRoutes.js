const express = require("express");
const { login, getUserAttendance, markAttendance, getUserImage, logout } = require("../controllers/userController");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post('/login',login);
router.get('/attendance',auth,getUserAttendance);
router.post('/markAttendance',auth,markAttendance);
router.get('/keyImage',auth,getUserImage);
router.post('/logout',logout)

module.exports = router;