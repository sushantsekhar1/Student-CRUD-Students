import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: '', email: '', course: '', address: '', mobile: '', dob: ''
  });
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch all students on load
  useEffect(() => {
    fetchStudents();
  }, []);

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:3000/students');
      const data = await res.json();
      console.log("Fetched students:", data); // Debug log
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  // Handle input field changes
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Submit or update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:3000/students/${editId}`
      : 'http://localhost:3000/students';

    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert(editId ? 'Student updated successfully!' : 'Student added successfully!');
        setFormData({ name: '', email: '', course: '', address: '', mobile: '', dob: '' });
        setEditId(null);
        fetchStudents();
      } else {
        alert('Failed to submit student');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  // Fill form for editing
  const handleEdit = (student) => {
    setFormData({
      name: student.name,
      email: student.email,
      course: student.course,
      address: student.address,
      mobile: student.mobile,
      dob: student.dob
    });
    setEditId(student.id);
  };

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const res = await fetch(`http://localhost:3000/students/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchStudents();
        alert('Student deleted');
      } else {
        alert('Failed to delete student');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="App">
      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit} className="form">
        {['name', 'email', 'course', 'address', 'mobile', 'dob'].map(field => (
          <input
            key={field}
            name={field}
            type={field === 'email' ? 'email' : field === 'dob' ? 'date' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            required
          />
        ))}
        <button type="submit">{editId ? 'Update' : 'Submit'}</button>
      </form>

      <h3>Submitted Students</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Course</th>
            <th>Address</th><th>Mobile</th><th>DOB</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.course}</td>
              <td>{s.address}</td>
              <td>{s.mobile}</td>
              <td>{s.dob}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.id)} className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;




