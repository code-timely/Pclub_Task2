const express = require("express");
const  connectDB = require("./database/connectDB");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes");
require("dotenv").config()

connectDB();

const app = express();

app.use(cors({
    credentials: true,
    origin: true
}));
app.use(cookieParser());
app.use(express.json(({ limit: '10mb'})));
app.use(express.urlencoded({limit: '10mb', extended: true}));

app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/user',userRouter);

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})
