import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import { UserLogin } from "./pages/user/UserLogin";
import { AdminLogin } from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/DashBoard";
import RegisterUser from "./pages/admin/RegisterUser";
import { Attendance } from "./pages/user/Attendance";
import MarkAttendance from "./pages/user/MarkAttendance";
import { UserAttendance } from "./pages/admin/UserAttendance";

function App() {


  return (
    <div> 
    <BrowserRouter>
      <Routes>
        <Route path = "/admin/login" element = {<AdminLogin></AdminLogin>} />
        <Route path = "/" element = {<UserLogin></UserLogin>} />
        <Route path = "/user/login" element = {<UserLogin></UserLogin>} />
        <Route path = '/admin/dashboard' element = {<Dashboard></Dashboard >} />
        <Route path="/admin/register_user" element = {<RegisterUser></RegisterUser>} />
        <Route path="/user/attendance" element = {<Attendance></Attendance>} />
        <Route path="/user/mark_attendance" element = {<MarkAttendance></MarkAttendance>} />
        <Route path="/admin/user_attendance" element = {<UserAttendance></UserAttendance>} />
      </Routes>
    </BrowserRouter>
  </div>
  
  )
}

export default App
