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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<div>Trang Admin</div>} /> {/* Trang mẫu cho admin */}
          <Route path="/template" element={<Template />}>
            <Route path="all" element={<ListTemplate />} />
            <Route path=":templateId" element={<TemplateDetail />} />
          </Route>
          <Route path="/editor" element={<EditorComponent />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
