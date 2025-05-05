import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../apis/profile';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CvByAI = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        position: '',
        layout: 'modern',
        font: 'Arial',
        styles: 'professional',
        theme: 'light',
        response_format: 'html',
        placeholders: ['[Your Name]', '[Your Email]'],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await getCurrentUser();
                setUserData(user);
            } catch (err) {
                setError('Failed to fetch user data');
            }
        };
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/api/ai/generate-cv', {
                userData,
                ...formData,
            });
            const cvHtml = response.data.content;
            // Navigate to ModernCVEditor with the generated HTML
            navigate('/cv-editor-ai', {
                state: {
                    template: {
                        name: `AI-Generated CV for ${formData.position}`,
                        type: 'AI-Generated',
                        content: cvHtml,
                    },
                },
            });
        } catch (err) {
            setError('Failed to generate CV');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Generate CV</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block">Position Applying For</label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block">Layout</label>
                    <select
                        name="layout"
                        value={formData.layout}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                        <option value="creative">Creative</option>
                    </select>
                </div>
                <div>
                    <label className="block">Font</label>
                    <select
                        name="font"
                        value={formData.font}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="Arial">Arial</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Helvetica">Helvetica</option>
                    </select>
                </div>
                <div>
                    <label className="block">Style</label>
                    <select
                        name="styles"
                        value={formData.styles}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="professional">Professional</option>
                        <option value="minimalist">Minimalist</option>
                        <option value="bold">Bold</option>
                    </select>
                </div>
                <div>
                    <label className="block">Theme</label>
                    <select
                        name="theme"
                        value={formData.theme}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="blue">Blue</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : 'Generate CV'}
                </button>
            </form>
        </div>
    );
};

export default CvByAI;