const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { User, Attendance } = require("../database/models");

exports.login = async (req, res) => {
    console.log("User LogIn got hit");
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({username});
  
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }
  
      const payload = {
        user: {
          id: user._id,
          role: 'user'
        }
      };
  
      const token = jwt.sign(payload,process.env.JWT_SECRET);
      const literal = "Bearer ".concat(token);

      res.cookie("token",literal);
      res.json({
        message: "User Log in successfull"
      })

    } 
    catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  };


exports.getUserAttendance = async (req, res) => {
    console.log("Get user attendance got hit");
    console.log(req.user);
    const userID = req.user.id;
    try {
      const user = await User.findById(userID);
      const attendance = await Attendance.find({
        _id: {
          "$in" : user.attendance
        }
      });
      res.json({
        name: user.name,
        attendance: attendance
      });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.markAttendance = async(req,res)=>{
  console.log("Mark User Attendance got hit!");
  console.log(req.user);
  const userID = req.user.id;
  try{
    const userAttendance = await Attendance.create({
      userID: userID
    });
    await User.updateOne({
      _id: userID
    },{
      "$push": {
        attendance: userAttendance._id
      }
    });
    res.json("Attendance marked successfully!");
  }
  catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

exports.getUserImage = async(req,res)=>{
  console.log("Get User Image got hit!");
  console.log(req.user);
  const userID = req.user.id;
  try{
    const user = await User.findById(userID);
    res.json({keyImage: user.keyImage});
  }
catch(err){
  console.error(err.message);
  res.status(500).send('Server Error');
}
}

exports.logout = (req,res)=>{
  res.cookie("token","");
  res.json({message:"Logged out successfully"});
}