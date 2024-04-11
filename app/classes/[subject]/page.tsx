"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { db } from "../../firebase"; // Adjust the path as per your project structure
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  DocumentData,
  doc,
  getDoc,
} from "firebase/firestore"; // Corrected imports

interface User {
  name: string;
  // Add any other fields you have in the 'users' document
}

const Page = () => {
  const [teachers, setTeachers] = useState<string[]>([]);
  const pathname = usePathname();
  const subject = pathname.replace("/classes/", "");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        if (!db) {
          console.error("Firebase is not initialized.");
          return;
        }

        const subjectQuery = query(
          collection(db, "subjects"),
          where("name", "==", subject)
        );
        const subjectSnapshot = await getDocs(subjectQuery);

        const assignedTeachers: string[] = [];

        // Iterate over each subject document
        subjectSnapshot.forEach((subjectDoc: DocumentData) => {
          const subjectData = subjectDoc.data();
          const subjectAssignedTeachers: string[] =
            subjectData.assignedTeachers || [];
          assignedTeachers.push(...subjectAssignedTeachers);
        });

        // Fetch user documents corresponding to assigned teacher IDs
        const usersQuery = query(
          collection(db, "users"),
          where("uid", "in", assignedTeachers)
        );
        const usersSnapshot = await getDocs(usersQuery);

        const teacherNames: string[] = [];

        usersSnapshot.forEach((userDoc: DocumentData) => {
          const userData = userDoc.data() as User;
          teacherNames.push(userData.name); // Assuming 'name' is a field in the 'users' document
        });

        setTeachers(teacherNames);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, [subject]);

  return (
    <div>
      <h1>{subject}</h1>
      <h2>Assigned Teachers:</h2>
      <ul>
        {teachers.map((teacher, index) => (
          <li key={index}>{teacher}</li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
