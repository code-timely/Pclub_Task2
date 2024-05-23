import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { InputBox } from "../../components/InputBox";
import { MyButton } from "../../components/MyButton";
import { BottomMessage } from "../../components/BottomMessage";
import axios from "axios"


export const AdminLogin = ()=>{
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const loginhandler = async()=>{
        await axios.post("http://localhost:3000/api/v1/admin/login",{
            username,
            password
        },{
            withCredentials: true,
        })
        navigate("/admin/dashboard");
    }

    return  <div className="bg-slate-200 h-screen">
        <div className="flex justify-center pt-28 pb-4 font-mono font-semibold text-3xl">Face Authenticated Attendance:Administration</div>
        <div className="flex justify-center font-light pb-10 text-2xl">Please enter admin credentials</div>
        <div className="flex justify-center m-5">
        <div className="rounded-lg bg-slate-50 w-80 text-center p-2 h-max px-4">
        <InputBox onChange={e=>setUsername(e.target.value)} placeholder="sakshamagarwal2295@gmail.com" label={" Enter username: "} />
        <div className="text-sm font-medium text-left py-2">Password</div>
        <input onChange={e=>setPassword(e.target.value)} placeholder="Minimum 8 characters" type="password" className="w-full px-2 py-1 border rounded border-slate-200" />
        <div onClick={loginhandler} className="pt-4">
          <MyButton label={"Log in"} />
        </div>
        <BottomMessage label={"want to log in as user?"} buttonText={"user Log-in"} to={"/user/login"} />
        </div>
        </div>
        </div>

}