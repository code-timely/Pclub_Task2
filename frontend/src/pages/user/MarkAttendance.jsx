import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOutIcon } from '@/components/LogOutIcon';
import { HistoryIcon } from '@/components/HistoryIcon';
import { CaptureIcon } from '@/components/CaptureIcon';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

export default function MarkAttendance() {
  const [keyImage, setKeyImage] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const webcamRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKeyImage = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/user/keyImage', { withCredentials: true });
        setKeyImage(response.data["keyImage"]);
        console.log(response.data["keyImage"]);
      } catch (error) {
        console.error('Error fetching key image:', error);
      }
    };

    fetchKeyImage();

    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    };

    loadModels();
  }, []);

  const captureImage = async () => {
    if (!webcamRef.current) {
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setMessage('Failed to capture image, please try again.');
      return;
    }

    setLoading(true);
    const img = new Image();
    img.src = imageSrc;
    img.onload = async () => {
      try {
        const detections = await faceapi.detectAllFaces(img, new faceapi.SsdMobilenetv1Options()).withFaceLandmarks().withFaceDescriptors();
        if (detections.length === 0) {
          setMessage('No face detected. Please try again.');
          setLoading(false);
          return;
        }

        const keyImg = await faceapi.fetchImage(keyImage);
        const keyImgDetections = await faceapi.detectSingleFace(keyImg).withFaceLandmarks().withFaceDescriptor();
        if (!keyImgDetections) {
          setMessage('Error detecting face in key image.');
          setLoading(false);
          return;
        }

        const faceMatcher = new faceapi.FaceMatcher(keyImgDetections);
        const bestMatch = detections.map(d => faceMatcher.findBestMatch(d.descriptor)).find(result => result.label === 'person 1');

        if (bestMatch) {
          await markAttendance();
        } else {
          setMessage('Authentication failed, please try again or contact admin.');
        }
      } catch (error) {
        console.error('Error during face detection and matching:', error);
        setMessage('Error processing the image, please try again.');
      } finally {
        setLoading(false);
      }
    };
  };

  const markAttendance = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/user/markAttendance', {}, { withCredentials: true });
      setMessage('Attendance marked successfully!');
    } catch (error) {
      console.error('Error marking attendance:', error);
      setMessage('Server error, please try again.');
    }
  };

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
          <Avatar className="h-10 w-10">
            <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
            <AvatarFallback className="text-black">JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">Welcome, John Doe</h1>
            <p className="text-gray-400 text-sm">Face Authenticated Attendance</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button className="text-white outline" onClick={() => navigate('/user/attendance')}>
            <HistoryIcon className="h-5 w-5 mr-2" />
            Attendance History
          </Button>
          <Button className="text-white bg-red-600 outline" onClick={() => {
            handleLogout();
            }}>
            <LogOutIcon className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Mark Attendance</h2>
        <div className="flex flex-col items-center">
          <Webcam ref={webcamRef} width="720" height="560" screenshotFormat="image/jpeg" className="border rounded-lg mb-4" />
          <Button className="text-white bg-blue-500 outline" onClick={captureImage} disabled={loading}>
            <CaptureIcon className="h-5 w-5 mr-2" />
            {loading ? 'Processing...' : 'Capture'}
          </Button>
        </div>
        {message && <p className="mt-4 text-center">{message}</p>}
      </main>
    </div>
  );
}
