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
import ClassroomListItem from "./ClassroomListCard";
import { getDocs, query, collection, where, doc , getDoc} from "firebase/firestore";
import { db } from "../app/firebase";

const HomeView: React.FC<HeaderProps> = ({ userType, uid }) => {
  const [teachersName, setTeachersName] = useState<string[]>([]);
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<
    {classroomUid: string }[]
  >([]);
  const [upcomingAssignments, setupcomingAssignments] = useState<string[]>([]);

  const [bookings, setBookings] = useState<any[]>([]); // State to store bookings

  useEffect(() => {
    if (userType === "student") {
      // fetchENrolledClassrooms
      const fetchEnrolledClassrooms = async () => {
        try {
          const classroomsRef = collection(db, "classrooms");
          const querySnapshot = await getDocs(classroomsRef);

          const classrooms: { teacherName: string; classroomUid: string }[] = [];

          querySnapshot.forEach((doc) => {
            const classroomData = doc.data();
            if (classroomData.students) {
              const student = classroomData.students.find((student: any) => student.studentUid === uid);
              if (student) {
                classrooms.push({
                  teacherName: classroomData.teacherName,
                  classroomUid: doc.id
                });
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
            console.log(userData.bookings);
            setBookings(userData.bookings || []); // Set bookings or initialize to empty array if not present
          } else {
            console.log("No document found with the provided uid.");
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      };

      const fetchAssignments = async() => {
        //TODO: fetch userData.assignments
        try {
          const usersRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(usersRef, where("uid", "==", uid!))
          );

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log(userData.bookings);
            setBookings(userData.bookings || []); // Set bookings or initialize to empty array if not present
          } else {
            console.log("No document found with the provided uid.");
          }
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      }

      fetchEnrolledClassrooms();
      fetchBookings();
      fetchAssignments();
    }
  }, [uid, userType]);

  console.log("Enrolled classroom: ",enrolledClassrooms);
  if (userType === "student") {
    return (
      <div>
        <Typography variant="h4">Your Classrooms</Typography>
        {enrolledClassrooms.length > 0 ? (
        <List className="flex mx-5">
          {enrolledClassrooms.map((classroom, index) => (
            <ListItem key={index}>
              <ListItemText primary={`Classroom UID: ${classroom.classroomUid}`} />
            </ListItem>
          ))}
        </List>
      ) : (
        <div>
          <Typography variant="body1">
            You're not a part of any classroom. Would you like to join one?
          </Typography>
        </div>
      )}

        <div style={{ marginTop: "20px" }}>
          <Typography variant="h4">Upcoming Tutoring Sessions:</Typography>
          {bookings.length > 0 ? (
            <List>
              {bookings.map((booking, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Date: ${booking.date}, Time Slot: ${booking.timeSlot}`}
                    secondary={`With Teacher: ${booking.teacherName}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">No bookings available</Typography>
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
