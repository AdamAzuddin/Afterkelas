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
import {
  getDocs,
  query,
  collection,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../app/firebase";
import { Assignment } from "@/utils/interface";
import AssignmentCard from "./AssignmentCard";


const Assignments: React.FC<HeaderProps> = ({ userType, uid }) => {
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<
    { classroomUid: string }[]
  >([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [bookings, setBookings] = useState<any[]>([]); // State to store bookings

  useEffect(() => {
    if (userType === "student" && uid) {
      const fetchEnrolledClassrooms = async () => {
        try {
          const classroomsRef = collection(db, "classrooms");
          const querySnapshot = await getDocs(classroomsRef);

          const classrooms: { classroomUid: string }[] = [];

          querySnapshot.forEach((doc) => {
            const classroomData = doc.data();
            if (classroomData.students) {
              const isEnrolled = classroomData.students.some(
                (student: any) => student.studentUid === uid
              );
              if (isEnrolled) {
                classrooms.push({ classroomUid: doc.id });
              }
            }
          });

          setEnrolledClassrooms(classrooms);
        } catch (error) {
          console.error("Error fetching enrolled classrooms:", error);
        }
      };

      const fetchBookings = async () => {
        try {
          const usersRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(usersRef, where("uid", "==", uid!))
          );

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setBookings(userData.bookings || []);
          } else {
            console.log("No document found with the provided uid.");
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      };

      fetchEnrolledClassrooms();
      fetchBookings();
    }
  }, [uid, userType]);

  useEffect(() => {
    if (enrolledClassrooms.length > 0) {
      const fetchAssignments = async () => {
        try {
          const assignmentsPromises = enrolledClassrooms.map(
            async (classroom) => {
              const classroomDocRef = doc(
                db,
                "classrooms",
                classroom.classroomUid
              );
              const classroomDocSnapshot = await getDoc(classroomDocRef);

              if (classroomDocSnapshot.exists()) {
                const classroomData = classroomDocSnapshot.data();
                return classroomData ? classroomData.assignments || [] : [];
              } else {
                console.log(
                  `Classroom with UID ${classroom.classroomUid} does not exist.`
                );
                return [];
              }
            }
          );

          const assignmentsResults = await Promise.all(assignmentsPromises);
          const mergedAssignments = assignmentsResults.flat();
          setAssignments(mergedAssignments);
        } catch (error) {
          console.error("Error fetching assignments:", error);
        }
      };

      fetchAssignments();
    }
  }, [enrolledClassrooms]);

  if (userType === "student") {
    return (
      <div>
        <div>
          <Typography variant="h4">Your Assignments</Typography>
          {assignments.length > 0 ? (
            <List>
              {assignments.map((assignment, index) => (
                <AssignmentCard key={index} assignment={assignment} />
              ))}
            </List>
          ) : (
            <Typography variant="body1">No assignments available</Typography>
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

export default Assignments;
