const express = require("express");
const { login, getUsers, addUser, logout, attendance } = require("../controllers/adminController");
const AdminRoleAuth = require("../middlewares/roleAuth");
const auth = require("../middlewares/auth");
const { UserSignUpValidator } = require("../middlewares/inputValidation");
const router = express.Router();

router.post('/login',login);
router.get('/getUsers',auth,AdminRoleAuth,getUsers);
router.post('/addUser',auth,AdminRoleAuth,UserSignUpValidator,addUser);
router.post('/logout',logout);
router.get('/attendance',auth,AdminRoleAuth,attendance);


module.exports = router;