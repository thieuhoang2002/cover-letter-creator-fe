import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './pages/Auth/AuthContext';
import Navbar from './components/Navbar';
import { GoogleOAuthProvider } from '@react-oauth/google';
import PrivateRoute from './pages/Auth/PrivateRoute';
import { CustomThemeProvider } from './context/ThemeContext';
import LoadingFallback from './components/LoadingFallback';

// Lazy loading các pages để tối ưu dung lượng bundle và tăng tốc độ tải trang
const Home = lazy(() => import('./pages/Home/Home'));
const Register = lazy(() => import('./pages/Auth/Register'));
const Login = lazy(() => import('./pages/Auth/Login'));
const TemplateDetail = lazy(() => import('./pages/TemplateDetail/TemplateDetail'));
const ListTemplate = lazy(() => import('./pages/Template/ListTemplate'));
const EditorComponent = lazy(() => import('./pages/Editor/Editor'));
const PdfExported = lazy(() => import('./pages/PdfExported/PdfExported'));
const LoveTemplate = lazy(() => import('./pages/LoveTemplate/LoveTemplate'));
const AuthCallback = lazy(() => import('./pages/Auth/AuthCallback'));
const AdminHomePage = lazy(() => import('./pages/Admin/AdminHomePage'));
const ChangePass = lazy(() => import('./pages/ChangePass/ChangePass'));
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword'));
const Information = lazy(() => import('./pages/Information/Information'));
const CvByAI = lazy(() => import('./pages/CvByAI/CvByAI'));
const CvEditor = lazy(() => import('./pages/CvEditor/CvEditor'));
const ListModernCV = lazy(() => import('./pages/ModernCV/ListModernCV'));
const ModernCVDetail = lazy(() => import('./pages/ModernCVDetail/ModernCVDetail'));
const ModernCVEditor = lazy(() => import('./pages/ModernCVEditor/ModernCVEditor'));
const EditorCvAI = lazy(() => import('./pages/CvByAI/EditorCvAI'));
const FollowCV = lazy(() => import('./pages/FollowCV/FollowCV'));

const gooleClientId = import.meta.env.VITE_CLIENT_ID;

function App() {
  return (
    <GoogleOAuthProvider clientId={gooleClientId}>
      <AuthProvider>
        <CustomThemeProvider>
          <BrowserRouter>
            <Navbar />
            <Suspense fallback={<LoadingFallback />}>
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

                {/* Route editor - Cần đăng nhập */}
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
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CustomThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
