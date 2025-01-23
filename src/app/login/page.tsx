'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Container, Typography } from '@mui/material';
import { loginUser } from "../services/services"; // เรียก API Login
import Swal from "sweetalert2";

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await loginUser(username, password); // เรียก API Login
  
      // เข้าถึงข้อมูลใน response.data
      const data = response.data;
      console.log('API Response:', data); // Debug ข้อมูลที่ได้จาก API

      if (data.success) {
        console.log('Login successful');
      
        // ตั้งค่า Cookie auth
        document.cookie = 'auth=true; path=/'; // Cookie แบบ Session
      
        // เก็บ token และข้อมูลเพิ่มเติมใน localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('name', data.name);
        localStorage.setItem('role', data.role);
      
        // Redirect ไปหน้า Dashboard
        console.log('Redirecting to /ui-components/dashboard');
        // router.push('/ui-components/dashboard');
        window.location.href = '/ui-components/dashboard';

      } else {
        Swal.fire({
          icon: "error",
          title: "Log In",
          text: data.message,
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: "error",
        title: "Log In",
        text: "An error occurred. Please try again.",
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleLogin}
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Container>
  );
}
