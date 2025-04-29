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
import PdfExported from './pages/PdfExported/PdfExported';
import LoveTemplate from './pages/LoveTemplate/LoveTemplate';
import Navbar from './components/Navbar';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthCallback from './pages/Auth/AuthCallback';
import AdminHomePage from './pages/Admin/AdminHomePage';
import PrivateRoute from './pages/Auth/PrivateRoute';
import ChangePass from './pages/ChangePass/ChangePass';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Information from './pages/Information/Information';
import CvByAI from './pages/CvByAI/CvByAI';
import CvEditor from './pages/CvEditor/CvEditor';

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

            {/* Route admin - Chỉ cho phép role 'admin' */}
            <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']} />}>
              <Route index element={<AdminHomePage />} />
            </Route>

            <Route path="/template/all" element={<ListTemplate />} />

            {/* <Route path="/template/:templateId" element={<TemplateDetail />} /> */}

            <Route path="/template/:templateId" element={<PrivateRoute />}>
              <Route index element={<TemplateDetail />} />
            </Route>

            {/* Route editor - Chỉ cần đăng nhập, không cần role cụ thể */}
            <Route path="/editor" element={<PrivateRoute />}>
              <Route index element={<EditorComponent />} />
            </Route>

            <Route path="/pdf-exported" element={<PdfExported />} />

            <Route path="/my-love-templates" element={<LoveTemplate />} />

            <Route path="/change-password" element={<ChangePass />} />

            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/information" element={<Information />} />

            <Route path="/create-cv-with-ai" element={<CvByAI />} />
            <Route path="/cv-editor-test" element={<CvEditor />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
