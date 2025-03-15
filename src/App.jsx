import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Auth from './pages/Auth/Auth';
import Template from './pages/Template/Template';
import TemplateDetail from './pages/TemplateDetail/TemplateDetail';
import ListTemplate from './pages/Template/ListTemplate';
import EditorComponent from './pages/Editor/Editor';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/template" element={<Template />}>
          <Route path="all" element={<ListTemplate />} />
          <Route path=":templateId" element={<TemplateDetail />} />
        </Route>
        <Route path="/editor" element={<EditorComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
