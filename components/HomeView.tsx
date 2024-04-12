"use client";
import React, { useEffect, useState } from "react";
import { HeaderProps } from "@/utils/interface";
import Link from "next/link";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { db } from "../app/firebase"; // Assuming you have a Firebase db instance
import { getDocs, query, collection, where, getDoc } from "firebase/firestore";
import { UserDetails } from "@/utils/interface";

const HomeView: React.FC<HeaderProps> = ({ userType, uid }) => {
  // Logic to fetch enrolled classrooms, upcoming tutoring sessions, and upcoming assignments goes here
  const upcomingTutoringSessions: string[] = []; // Replace with actual logic to fetch upcoming tutoring sessions
  const upcomingAssignments: string[] = []; // Replace with actual logic to fetch upcoming assignments
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<string[]>([]);
  const [teachersName, setTeachersName] = useState<string[]>([]);

  useEffect(() => {
    const fetchEnrolledClassrooms = async () => {
      try {
        if (!db) {
          console.error("Firebase is not initialized.");
          return;
        }

        const classroomsRef = collection(db, "classrooms");
        const querySnapshot = await getDocs(
          query(classroomsRef, where("students", "array-contains", uid))
        );

        const classrooms: string[] = [];
        const namesPromises: Promise<string>[] = [];

        querySnapshot.forEach((doc) => {
          const classroomId = doc.id;
          classrooms.push(classroomId);

          const teacherRef = doc.data().teacher;
          const teacherUid = teacherRef.id;

          const teacherRefBaseUid = collection(db, "users");
          const teacherPromise = getDocs(
            query(teacherRefBaseUid, where("uid", "==", teacherUid))
          ).then((teacherSnapshot) => {
            if (!teacherSnapshot.empty) {
              const teacherData = teacherSnapshot.docs[0].data() as UserDetails;
              return teacherData.name;
            } else {
              console.log("No user document found with the provided uid.");
              return ""; // Return an empty string if no user found
            }
          });
          namesPromises.push(teacherPromise);
        });

        const teacherNames = await Promise.all(namesPromises);
        setEnrolledClassrooms(classrooms);
        setTeachersName(teacherNames.filter((name) => name !== ""));
      } catch (error) {
        console.error("Error fetching enrolled classrooms:", error);
      }
    };

    if (userType === "student") {
      fetchEnrolledClassrooms();
    }
  }, [uid, userType]);

  useEffect(() => {
    // This useEffect will run every time teachersName changes
    console.log("Teachers name changed:", teachersName);
  }, [teachersName]);

  if (userType === "student") {
    return (
      <div>
        <Typography variant="h4">Your Classrooms</Typography>
        {teachersName.length > 0 ? (
          <>
            <List>
              {teachersName.map((teacherName, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${teacherName}'s Class`} />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <div>
            <Typography variant="body1">
              You're not a part of any classroom. Would you like to join one?
            </Typography>
            <Button variant="contained" color="primary">
              Join a Classroom
            </Button>
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <Typography variant="h4">Upcoming Tutoring Sessions:</Typography>
          {upcomingTutoringSessions.length > 0 ? (
            <List>
              {upcomingTutoringSessions.map((session, index) => (
                <ListItem key={index}>
                  <ListItemText primary={session} />
                </ListItem>
              ))}
            </List>
          ) : (
            <div>
              <Typography variant="body1">
                There are no upcoming tutoring sessions.
              </Typography>
              <Button variant="contained" color="primary">
                Add Tutoring Session
              </Button>
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <Typography variant="h4">Upcoming Assignments:</Typography>
          {upcomingAssignments.length > 0 ? (
            <List>
              {upcomingAssignments.map((assignment, index) => (
                <ListItem key={index}>
                  <ListItemText primary={assignment} />
                </ListItem>
              ))}
            </List>
          ) : (
            <div>
              <Typography variant="body1">
                There are no upcoming assignments.
              </Typography>
            </div>
          )}
        </div>
      </div>
    );
  } else if (userType === "teacher" || userType === "admin") {
    // Leave empty div for teacher and admin
    return <div></div>;
  } else {
    // Display sign-in message with a link to /auth/sign-in
    return (
      <div>
        <Typography variant="body1">Please sign in</Typography>
        <Link href={"/auth/sign-in"} passHref>
          <Button variant="contained" color="primary">
            Sign In
          </Button>
        </Link>
      </div>
    );
  }
};

export default HomeView;
