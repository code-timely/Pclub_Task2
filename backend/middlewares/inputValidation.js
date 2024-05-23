const z = require("zod");

const UserSchema = z.object({
    name: z.string(),
    username: z.string().email(),
    password: z.string().min(8),
    keyImage: z.string()
});

exports.UserSignUpValidator = (req,res,next)=>{
    console.log("UserSignUpValidator got hit");
    const Payload = req.body;
    const parsedPayload = UserSchema.safeParse(Payload);
    if(parsedPayload.success)
        next();
    else 
        res.status(411).json("Enter Valid Credentials");
}