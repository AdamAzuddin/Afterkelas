"use client";
import React, { useState } from "react";
import "./style.css";

const Page = () => {
  const [attendances, setAttendances] = useState([
    {
      name: "Hasif",
      subject: "Accounting",
      role: "Student",
      status: "Present",
    },
    {
      name: "Amirul",
      subject: "Biology",
      role: "Teacher",
      status: "Absent",
    },
  ]);

  // Function to handle form submission
  const handleFormSubmit = (event: any) => {
    event.preventDefault();

    const name = event.target.elements.name.value;
    const subject = event.target.elements.subject.value;
    const role = event.target.elements.role.value;
    const status = "Present"; // Default status on submission

    // Update attendance list with new record
    setAttendances([...attendances, { name, subject, role, status }]);

    // Reset form fields
    event.target.reset();
  };

  // Function to delete an attendance record
  const deleteAttendance = (index: any) => {
    const updatedAttendances = [...attendances];
    updatedAttendances.splice(index, 1);
    setAttendances(updatedAttendances);
  };

  return (
    <div className="page-container">
      <div className="welcome-message">
        <h1 className="text-4xl">Attendance</h1>
        <hr />
      </div>
      <div className="container">
        <div className="top-section">
          <div className="inputs">
            <form onSubmit={handleFormSubmit} className="submission-form">
              <div className="flex flex-col">
                <label htmlFor="datetime">Class Date and Time:</label>
                <input
                  type="datetime-local"
                  id="datetime"
                  name="datetime"
                  required
                />
                <div className="flex">
                  <label htmlFor="subject">Subject:</label>
                  <select id="subject" name="subject" required className="pl-3">
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Additional Mathematics">Additional Mathematics</option>
                    <option value="Accounting">Accounting</option>
                    <option value="Economics">Economics</option>
                  </select>
                </div>

                <div className="flex">
                  <label htmlFor="role">Role:</label>
                  <select id="role" name="role" required className="pl-3">
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </div>
                <div className="flex">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    style={{ width: "300px" }}
                    required
                    className="pl-3"
                  />
                </div>
              </div>

              <input type="submit" value="Submit" className="submit-bttn" />
            </form>
          </div>
        </div>

        <div className="bottom-section">
          <div className="attendance-table">
            <table>
              <thead>
                <tr>
                  <th className="name-column">Name</th>
                  <th className="subject-column">Class</th>
                  <th className="role-column">Role</th>
                  <th className="att-column">Status</th>
                  <th className="delete-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendances.map((attendance, index) => (
                  <tr key={index}>
                    <td className="name">{attendance.name}</td>
                    <td>{attendance.subject}</td>
                    <td>{attendance.role}</td>
                    <td>{attendance.status}</td>
                    <td>
                      <button
                        onClick={() => deleteAttendance(index)}
                        className="delete-btn"
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
      </div>
    </div>
  );
};

export default Page;
