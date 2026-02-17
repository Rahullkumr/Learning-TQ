import { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentCrud.css';

const API_URL = 'http://localhost:3000/students'; // Base URL for API

const StudentCrud = () => {
    const [students, setStudents] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Fetch students on component mount
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get(API_URL);
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone || !formData.age) {
            alert('Please fill in all fields');
            return;
        }

        const payload = {
            ...formData,
            age: Number(formData.age), // Ensure age is a number
            created_by: 1 // Hardcoded as per requirement
        };

        try {
            if (isEditing) {
                await axios.put(`${API_URL}/${currentId}`, payload);
                setIsEditing(false);
                setCurrentId(null);
            } else {
                await axios.post(API_URL, payload);
            }
            // Refresh list and clear form
            fetchStudents();
            setFormData({ name: '', email: '', phone: '', age: '' });
        } catch (error) {
            console.error('Error saving student:', error);
            alert('Failed to save student. See console for details.');
        }
    };

    const handleEdit = (student) => {
        setFormData({
            name: student.name,
            email: student.email,
            phone: student.phone,
            age: student.age
        });
        setIsEditing(true);
        setCurrentId(student.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchStudents();
            } catch (error) {
                console.error('Error deleting student:', error);
                alert('Failed to delete student.');
            }
        }
    };

    return (
        <div className="student-crud-container">
            <div className="header">
                <h2>Student Management System</h2>
            </div>

            <form onSubmit={handleSubmit} className="student-form">
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>
                <button type="submit" className={`btn ${isEditing ? 'btn-update' : 'btn-add'}`}>
                    {isEditing ? 'Update Student' : 'Add Student'}
                </button>
            </form>

            <table className="student-list">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>{student.phone}</td>
                                <td>{student.age}</td>
                                <td className="actions">
                                    <button
                                        onClick={() => handleEdit(student)}
                                        className="btn btn-edit"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="btn btn-delete"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="empty-message">No students found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default StudentCrud;
