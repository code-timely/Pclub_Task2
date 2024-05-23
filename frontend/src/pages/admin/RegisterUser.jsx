import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import { Spinner } from '@chakra-ui/react';
import { z } from 'zod';
import { FiArrowLeft, FiLogOut } from 'react-icons/fi';

export default function RegisterUser() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [isWebcam, setIsWebcam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const UserSchema = z.object({
    name: z.string().nonempty('Name is required'),
    username: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    keyImage: z.string()
  });

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    };

    loadModels();
  }, []);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    await handleImageValidation(imageSrc);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = async () => {
      await handleImageValidation(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageValidation = async (imageSrc) => {
    setLoading(true);
    setError('');
    setImage(null);

    const img = new Image();
    img.src = imageSrc;
    img.onload = async () => {
      const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());

      if (detections.length === 0) {
        setLoading(false);
        setError('No face detected. Please try again.');
      } else if (detections.length > 1) {
        setLoading(false);
        setError('More than one face detected. Please try again.');
      } else {
        setLoading(false);
        setImage(imageSrc);
        setError('');
      }
    };
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const parsedPayload = UserSchema.safeParse({
        name,
        username,
        password,
        keyImage: image
      });

      if (!parsedPayload.success) {
        setError(parsedPayload.error.errors.map(err => err.message).join(', '));
        return;
      } 
      else setError("");
      await axios.post('http://localhost:3000/api/v1/admin/addUser',{
        name: name,
        username: username,
        password: password,
        keyImage: image
      },{
        withCredentials: true
      });
      alert('User registered successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('There was an error registering the user!', error);
    }
  };

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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl">Admin Access</h1>
        <div className='flex'>
          <button
            className="bg-black text-white border border-white px-4 py-2 rounded mr-2 flex items-center transition-transform transform hover:scale-105 hover:shadow-lg"
            onClick={() => {
              navigate('/admin/dashboard')
            }}
          >
            <FiArrowLeft className="mr-2" />
            Dashboard
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center transition-transform transform hover:scale-105 hover:shadow-lg"
            onClick={handleLogout}
          >
            <FiLogOut className="mr-2" />
            Log Out
          </button>
        </div>
      </header>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-lg space-y-6 rounded-lg bg-white p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Register User</h1>
            <p>{error && <span className="text-red-500">{error}</span>}</p>
          </div>
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="abc@iitk.ac.in"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm leading-4 font-medium rounded-md shadow-sm"
                  onClick={() => setIsWebcam(true)}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 10l4.94-4.94a1.5 1.5 0 00-2.12-2.12L10 7.88 4.12 2H4a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-.12l-5.88-5.88-5.88 5.88v.12a1.5 1.5 0 002.12 2.12L10 16.12l4.94 4.94a1.5 1.5 0 002.12-2.12L15 14.12V10z"
                    ></path>
                  </svg>
                  Take Photo
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm leading-4 font-medium rounded-md shadow-sm"
                  onClick={() => fileInputRef.current.click()}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 12v.01m6.8-6.8a4 4 0 00-5.6-5.6L12 2l-1.2-1.2a4 4 0 00-5.6 5.6L4 6v12a2 2 0 002 2h12a2 2 0 002-2V6l-1.2-1.2z"
                    ></path>
                  </svg>
                  Choose Photo
                </button>
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            {isWebcam && (
              <div className="mb-4">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full mt-4 rounded"
                />
                <button
                  type="button"
                  className="mt-2 w-full inline-flex justify-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm"
                  onClick={handleCapture}
                >
                  Capture
                </button>
              </div>
            )}
            {loading && <div className="flex justify-center mt-4"><Spinner size="xl" /></div>}
            {image && <img src={image} alt="Captured" className="w-full mt-4 rounded" />}
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}