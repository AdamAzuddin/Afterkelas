"use client";
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { db } from '../../firebase'; // Adjust the path as per your project structure
import { getDocs, query, collection, where } from 'firebase/firestore';
import { Grid } from '@mui/material'; // Import Grid from Material-UI
import TeacherCard from '../../../components/TeacherCard'; // Import the custom TeacherCard component

interface User {
  name: string;
}

const Page = () => {
  const [teachers, setTeachers] = useState<string[]>([]);
  const [assignedTeachers, setAssignedTeachers] = useState<string[]>([]);
  const pathname = usePathname();
  const subject = pathname.replace('/classes/', '');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        if (!db) {
          console.error('Firebase is not initialized.');
          return;
        }

        const subjectQuery = query(collection(db, 'subjects'), where('name', '==', subject));
        const subjectSnapshot = await getDocs(subjectQuery);

        const assignedTeachers: string[] = [];

        subjectSnapshot.forEach((subjectDoc) => {
          const subjectData = subjectDoc.data();
          const subjectAssignedTeachers: string[] = subjectData.assignedTeachers || [];
          assignedTeachers.push(...subjectAssignedTeachers);
        });

        setAssignedTeachers(assignedTeachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, [subject]);

  useEffect(() => {
    const fetchTeacherNames = async () => {
      try {
        if (!db) {
          console.error('Firebase is not initialized.');
          return;
        }

        const usersQuery = query(collection(db, 'users'), where('uid', 'in', assignedTeachers));
        const usersSnapshot = await getDocs(usersQuery);

        const teacherNames: string[] = [];

        usersSnapshot.forEach((userDoc) => {
          const userData = userDoc.data() as User;
          teacherNames.push(userData.name);
        });

        setTeachers(teacherNames);
      } catch (error) {
        console.error('Error fetching teacher names:', error);
      }
    };

    if (assignedTeachers.length > 0) {
      fetchTeacherNames();
    }
  }, [assignedTeachers]);

  return (
    <Grid container spacing={3} justifyContent="center">
      {teachers.map((teacher, index) => (
        <Grid item key={index}>
          <TeacherCard name={teacher} uid={assignedTeachers[index]} />
        </Grid>
      ))}
    </Grid>
  );
};

export default Page;
