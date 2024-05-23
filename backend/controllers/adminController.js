const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Admin, Attendance } = require("../database/models");

exports.login = async (req, res) => {
  console.log("Admin LogIn route got hit");
  const { username, password } = req.body;
  try {
    
    const admin = await Admin.findOne({username});
    
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: admin._id,
        role: 'admin'
      }
    };

    const token = jwt.sign(payload,process.env.JWT_SECRET);
    const literal = "Bearer ".concat(token);
    console.log(literal);
    res.cookie("token",literal);

    res.json({
      message: "Admin log in successfull!"
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getUsers = async (req, res) => {
  console.log("Get all users got hit");
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addUser = async (req, res) => {
  const {name, username, password, keyImage } = req.body;
  try {
    const user = new User({name, username, password, keyImage });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.json({ msg: 'User added' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.logout = (req,res)=>{
  res.cookie("token","");
  res.json({message:"Logged out successfully"});
}

exports.attendance = async (req, res) => {
  console.log("Get user attendance, by admin got hit");
  
  const userID = req.query.userID; 
  if (!userID) {
    return res.status(400).send('UserID is required');
  }
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const attendance = await Attendance.find({
      _id: {
        "$in": user.attendance
      }
    });
    res.json({
      attendance: attendance
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};