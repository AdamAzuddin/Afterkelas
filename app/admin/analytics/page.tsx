"use client";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import './style.css';


interface Subject {
  id: string;
  name: string;
  assignedStudents: any[];
  assignedTeachers: any[];
}

const Page = () => {
  const [subjectsData, setSubjectsData] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectsCollection = collection(db, "subjects");
        const snapshot = await getDocs(subjectsCollection);
        const subjects = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          assignedStudents: doc.data().assignedStudents ?? [],
          assignedTeachers: doc.data().assignedTeachers ?? [],
        }));
        setSubjectsData(subjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div className="analytics-container">
      <h1 className="text-4xl ">Analytics</h1>
      <div className="analytics-table">
        <table>
          <thead>
            <tr>
              <th className="subject text-white">Subject</th>
              <th className="teachers text-white">Teachers</th>
              <th className="students text-white">Students</th>
            </tr>
          </thead>
          <tbody>
            {subjectsData.map(subject => (
              <tr key={subject.id}>
                <td>{subject.name}</td>
                <td>{subject.assignedTeachers.length || 0}</td>
                <td>{subject.assignedStudents.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

};

export default Page;
