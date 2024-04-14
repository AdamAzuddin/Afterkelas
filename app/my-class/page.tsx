"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
} from "@mui/material"; // Import Material-UI components
// Adjust the import path to firebase.js if needed
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  getDocs,
  query,
  collection,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../app/firebase"; // Adjust the path as per your project structure

interface Classroom {
  uid: string;
  teacher: string;
  subject: string;
  students: string[]; // Assuming student IDs are stored
}

interface Subject {
  uid: string;
  name: string;
}

const MyClassPage: React.FC = () => {
  const [classroom, setClassroom] = useState<Classroom>();
  const [subjectName, setSubjectName] = useState();
  const [subjectDocName, setsubjectDocName] = useState("");

  const [user, setUser] = React.useState<User | null>(null);
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setUser(user);
    });

    const getMyClass = async () => {
      if (user) {
        try {
          if (!db) {
            console.error("Firebase is not initialized.");
            return;
          }

          const classroomRef = collection(db, "classrooms");

          const querySnapshot = await getDocs(
            query(classroomRef, where("teacher", "==", user.uid))
          );

          if (!querySnapshot.empty) {
            const classroomData = querySnapshot.docs[0].data() as Classroom;
            setsubjectDocName(classroomData.subject);
            const subjectRef = doc(db, "subjects", classroomData.subject);

            const subjectSnapshot = await getDoc(subjectRef);

            if (subjectSnapshot.exists()) {
              const subjectData = subjectSnapshot.data();

              setSubjectName(subjectData.name);
            }

            setClassroom(classroomData);
          } else {
            console.log(
              "No classroom document found with the provided teacher reference."
            );
          }
        } catch (error) {
          console.error("Error fetching classroom data:", error);
        }
      } else {
        console.log("User or teacherDocName is null.");
      }
    };
    
    

    getMyClass();

    return () => {
      unsubscribe();
    };
  }, [user]);
  //TODO: Add button that link to /my-class/new-assignment

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" gutterBottom>
        Subject name: {subjectName}
      </Typography>
    </Container>
  );
};

export default MyClassPage;
