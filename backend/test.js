// // const crypto = require('crypto');

// // const secretLengthBytes = 32;

// // const randomBytes = crypto.randomBytes(secretLengthBytes);

// // const jwtSecret = randomBytes.toString('base64');

// // console.log(`\n${jwtSecret}\n`);
// // require("dotenv").config()

// // console.log(process.env.MONGO_URI);
// const z = require("zod");

// const UserSchema = z.object({
//     name: z.string(),
//     userID: z.string().email(),
//     password: z.string().min(8),
//     keyImage: z.string()
// });

// console.log(UserSchema.safeParse(
//     {
//         name: "Saks",
//         userID: "saxiitk.ac.in",
//         password: "hola amigo!",
//         keyImage: "<image>"
//     }
// ).error[0])


const bcrypt = require('bcryptjs');

const fn = async () =>{
    // const salt = await bcrypt.genSalt(10);
    // const a = await bcrypt.hash("code_saks", salt);
    //console.log(a);
    const b = "code_saks";
    const isMatch = await bcrypt.compare("code_saks", "$2a$10$LSy4QhaIDdThmL2qgqXna.IMI36otbf6VieEfBDU9fm9v73/kuh3G");
    console.log(isMatch)
}
fn();