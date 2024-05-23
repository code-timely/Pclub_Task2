import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import { LogOutIcon } from "@/components/LogOutIcon";
import { MyCheckIcon } from "@/components/MyCheckIcon"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [name, setName] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/api/v1/user/attendance', {
       withCredentials: true 
      })
      .then((response) => {
        console.log(response);
        setAttendance(response.data.attendance);
        setName(response.data.name);
      })
      .catch(error => {
        console.error('Error fetching attendance:', error);
      });
  }, []);

  const handleLogout = () => {
    axios.post('http://localhost:3000/api/v1/user/logout', {}, { withCredentials: true })
      .then(() => {
        navigate('/'); 
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10" >
            <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback className="text-black">{name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">Welcome, {name}</h1>
            <p className="text-gray-400 text-sm">Face Authenticated Attendance</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button className=" text-white outline" onClick = {handleLogout}>
            <LogOutIcon className="h-5 w-5 mr-2" />
            Logout
          </Button>
          <Button className="text-white outline" onClick = {()=>{navigate("/user/mark_attendance")}} >
            <MyCheckIcon className="h-5 w-5 mr-2" />
            Mark Attendance
          </Button>
        </div>
      </header>
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Attendance History</h2>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Serial</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {attendance.map((a, index) => {
              const attend = new Date(a.date);
                const markedDate = attend.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                });
                const markedTime = attend.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                });

                return (
                  <TableRow key={index} className="hover:bg-gray-100">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{markedDate}</TableCell>
                    <TableCell>{markedTime}</TableCell>
                    <TableCell>
                      <Badge variant="success">Present</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
}

