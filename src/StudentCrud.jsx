import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import './StudentCrud.css';

const API_URL = 'http://localhost:3000/students'; // Base URL for API

const getStudents = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const createStudent = async (student) => {
    return await axios.post(API_URL, student);
};

const updateStudent = async ({ id, ...student }) => {
    return await axios.put(`${API_URL}/${id}`, student);
};

const deleteStudent = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};

const StudentCrud = () => {
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Queries
    const { data: students = [], isLoading, isError, error } = useQuery({
        queryKey: ['students'],
        queryFn: getStudents,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: createStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            alert("Student created successfully!");
            setFormData({ name: '', email: '', phone: '', age: '' });
        },
        onError: (error) => {
            console.error("Error creating student:", error);
            alert("Failed to create student.");
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            alert("Student updated successfully!");
            setFormData({ name: '', email: '', phone: '', age: '' });
            setIsEditing(false);
            setCurrentId(null);
        },
        onError: (error) => {
            console.error("Error updating student:", error);
            alert("Failed to update student.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            alert("Student deleted successfully!");
        },
        onError: (error) => {
            console.error("Error deleting student:", error);
            alert("Failed to delete student.");
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
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

        if (isEditing) {
            updateMutation.mutate({ id: currentId, ...payload });
        } else {
            createMutation.mutate(payload);
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

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="loading">Loading students...</div>;
    if (isError) return <div className="error">Error: {error.message}</div>;

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
                <button type="submit" className={`btn ${isEditing ? 'btn-update' : 'btn-add'}`} disabled={createMutation.isPending || updateMutation.isPending}>
                    {isEditing ? (updateMutation.isPending ? 'Updating...' : 'Update Student') : (createMutation.isPending ? 'Adding...' : 'Add Student')}
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
                                        disabled={deleteMutation.isPending && deleteMutation.variables === student.id}
                                    >
                                        {deleteMutation.isPending && deleteMutation.variables === student.id ? 'Deleting...' : 'Delete'}
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
