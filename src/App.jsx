import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './pages/Auth/AuthContext';
import Home from './pages/Home/Home';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
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
import ListModernCV from './pages/ModernCV/ListModernCV';
import ModernCVDetail from './pages/ModernCVDetail/ModernCVDetail';
import ModernCVEditor from './pages/ModernCVEditor/ModernCVEditor';
import EditorCvAI from './pages/CvByAI/EditorCvAI';
import FollowCV from './pages/FollowCV/FollowCV';
import { CustomThemeProvider } from './context/ThemeContext';

const gooleClientId = import.meta.env.VITE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={gooleClientId}>
      <AuthProvider>
        <CustomThemeProvider>
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
            <Route path="/modern-cv/all" element={<ListModernCV />} />

            <Route path="/template/:templateId" element={<TemplateDetail />} />
            <Route path="/modern-cv/:templateId" element={<ModernCVDetail />} />

            {/* Route editor - Chỉ cần đăng nhập, không cần role cụ thể */}
            <Route path="/editor" element={<PrivateRoute />}>
              <Route index element={<EditorComponent />} />
            </Route>

            <Route path="/modern-cv-editor" element={<PrivateRoute />}>
              <Route index element={<ModernCVEditor />} />
            </Route>

            <Route path="/pdf-exported" element={<PrivateRoute />}>
              <Route index element={<PdfExported />} />
            </Route>

            <Route path="/my-love-templates" element={<PrivateRoute />}>
              <Route index element={<LoveTemplate />} />
            </Route>

            <Route path="/change-password" element={<PrivateRoute />}>
              <Route index element={<ChangePass />} />
            </Route>

            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/information" element={<PrivateRoute />}>
              <Route index element={<Information />} />
            </Route>

            <Route path="/cv-editor-test" element={<CvEditor />} />

            <Route path="/create-cv-with-ai" element={<PrivateRoute />}>
              <Route index element={<CvByAI />} />
            </Route>

            <Route path="/cv-editor-ai" element={<PrivateRoute />}>
              <Route index element={<EditorCvAI />} />
            </Route>

            <Route path="/follow-cv" element={<PrivateRoute />}>
              <Route index element={<FollowCV />} />
            </Route>

            {/* Route Auth */}
          </Routes>
        </BrowserRouter>
        </CustomThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
