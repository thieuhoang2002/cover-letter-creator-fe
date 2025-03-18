import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './pages/Auth/AuthContext';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Template from './pages/Template/Template';
import TemplateDetail from './pages/TemplateDetail/TemplateDetail';
import ListTemplate from './pages/Template/ListTemplate';
import EditorComponent from './pages/Editor/Editor';
import Navbar from './components/Navbar';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthCallback from './pages/Auth/AuthCallback';
import AdminHomePage from './pages/Admin/AdminHomePage';

const gooleClientId = import.meta.env.VITE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={gooleClientId}>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/admin" element={<AdminHomePage />} />
            <Route path="/template" element={<Template />}>
              <Route path="all" element={<ListTemplate />} />
              <Route path=":templateId" element={<TemplateDetail />} />
            </Route>
            <Route path="/editor" element={<EditorComponent />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
