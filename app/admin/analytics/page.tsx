"use client"
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/firebase';

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
        const subjectsCollection = collection(db, 'subjects');
        const snapshot = await getDocs(subjectsCollection);          
        const subjects = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          assignedStudents: doc.data().assignedStudents ?? [],
          assignedTeachers: doc.data().assignedTeachers ?? [],
        }));
        setSubjectsData(subjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  return (
    <div>
      <h1>Subjects Data</h1>
      <ul>
        {subjectsData.map(subject => (
          <li key={subject.id}>
            <p>Subject: {subject.name}</p>
            <p>Number of Assigned Students: {subject.assignedStudents.length}</p>
            <p>Number of Assigned Teachers: {subject.assignedTeachers.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
