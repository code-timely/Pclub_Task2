import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { LogOutIcon } from "@/components/LogOutIcon";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FiArrowLeft } from 'react-icons/fi';

export function UserAttendance() {
  const location = useLocation();
  const { userID } = location.state || {};
  const [attendance, setAttendance] = useState([]);
  const navigate = useNavigate();
  console.log(userID);  // Debugging line

  useEffect(() => {
    if (userID) {
        console.log("hi");
      axios.get('http://localhost:3000/api/v1/admin/attendance', {
        params: { userID },
        withCredentials: true
      })
      .then((response) => {
        console.log(response);  // Debugging line
        setAttendance(response.data.attendance);
      })
      .catch(error => {
        console.error('Error fetching attendance:', error);
      });
    } else {
      console.error('No userID provided');
    }
  }, [userID]);

  const handleLogout = () => {
    axios.post('http://localhost:3000/api/v1/admin/logout', {}, { withCredentials: true })
      .then(() => {
        navigate('/admin/login');
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback className="text-black">A</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">Admin</h1>
            <p className="text-gray-400 text-sm">Face Authenticated Attendance</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button className="text-white outline" onClick={handleLogout}>
            <LogOutIcon className="h-5 w-5 mr-2" />
            Logout
          </Button>
          <Button className="text-white outline" onClick={() => { navigate("/admin/dashboard") }} >
            <FiArrowLeft className="mr-2" />
            Dashboard
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
  );
}

export default UserAttendance;