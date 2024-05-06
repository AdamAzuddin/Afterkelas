"use client";

import React, { useState } from "react";
import "./style.css";

const Page = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [users, setUsers] = useState<
    { name: string; email: string; userType: string }[]
  >([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    userType: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUser = () => {
    const { name, email, userType } = formData;
    if (name && email && userType) {
      setUsers([...users, { name, email, userType }]);
      setFormData({ name: "", email: "", userType: "" }); // Clear form data
      setShowOverlay(false); // Close overlay after adding user
    }
  };

  const handleDeleteUser = (index: number) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="welcome-message">
        <h3 className="text-2xl font-bold">Manage Users</h3>
      </div>

      <div className="flex items-center justify-between mb-4"></div>

      {/* Overlay */}
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h3 className="text-xl font-bold mb-4">Add User</h3>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Name"
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={handleInputChange}
              className="input-field"
            />
            <select
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="">Select User Type</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleAddUser}
            >
              Add User
            </button>
            <button
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded ml-4"
              onClick={() => setShowOverlay(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="users-table">
        <div className="flex justify-between">
          <h3 className="text-xl font-bold mb-4">Users List</h3>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={() => setShowOverlay(true)}
          >
            <i className="bx bx-plus-circle icon text-lg mr-2"></i>
            <span>Add User</span>
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="name-column">Name</th>
              <th className="email-column">Email</th>
              <th className="role-column">User Type</th>
              <th className="delete-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.userType}</td>
                <td>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteUser(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
