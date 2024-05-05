"use client";
import React, { useEffect, useState } from "react";
import { HeaderProps } from "@/utils/interface";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Container,
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
import PleaseSignIn from "./PleaseSignIn";

const HomeView: React.FC<HeaderProps> = ({ userType, uid }) => {
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [bookings, setBookings] = useState<any[]>([]); // State to store bookings

  useEffect(() => {
    if (userType === "student" && uid) {
      const fetchEnrolledClassrooms = async () => {
        try {
          const classroomsRef = collection(db, "classrooms");
          const querySnapshot = await getDocs(classroomsRef);

          const classrooms: string[] = [];

          querySnapshot.forEach((doc) => {
            const classroomData = doc.data();
            if (classroomData.students) {
              const isEnrolled = classroomData.students.includes(uid);
              if (isEnrolled) {
                classrooms.push(doc.id);
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
            async (classroomUid) => {
              const classroomDocRef = doc(db, "classrooms", classroomUid);
              const classroomDocSnapshot = await getDoc(classroomDocRef);

              if (classroomDocSnapshot.exists()) {
                const classroomData = classroomDocSnapshot.data();
                const assignments = classroomData
                  ? classroomData.assignments || []
                  : [];

                // Filter assignments based on whether they have been submitted or not
                const filteredAssignments = await Promise.all(
                  assignments.map(async (assignment: any) => {
                    const submissionsRef = collection(db, "submissions");
                    const submissionQuerySnapshot = await getDocs(
                      query(
                        submissionsRef,
                        where("assignmentId", "==", assignment.assignmentId)
                      )
                    );

                    if (submissionQuerySnapshot.empty) {
                      return assignment; // Return assignment if no submission exists for it
                    } else {
                      return null; // Return null if submission exists
                    }
                  })
                );

                return filteredAssignments.filter(
                  (assignment) => assignment !== null
                ); // Filter out null assignments
              } else {
                console.log(
                  `Classroom with UID ${classroomUid} does not exist.`
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
        <Typography variant="h4">Your Classrooms</Typography>
        {enrolledClassrooms.length > 0 ? (
          <List className="flex mx-5">
            {enrolledClassrooms.map((classroomUid, index) => (
              <ListItem key={index}>
                <ListItemText primary={`Classroom UID: ${classroomUid}`} />
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

        <div>
          <Typography variant="h4">Your Assignments</Typography>
          {assignments.length > 0 ? (
            <List className="mx-5">
              {assignments.map((assignment, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Title: ${assignment.title}`}
                    secondary={`Due Date: ${assignment.dueDate}`}
                  />
                  {assignment.description && (
                    <ListItemText
                      primary={`Description: ${assignment.description}`}
                    />
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1">No assignments available</Typography>
          )}
        </div>
      </div>
    );
  } else if (userType === "teacher") {
    return <div>Hi teacher!</div>;
  } else if (userType === "admin") {
    return (
      <Container maxWidth="md" className="mt-8">
        <Typography variant="h4" gutterBottom>
          Welcome, Admin!
        </Typography>

        <div className="mt-6">
          <Typography variant="h5" gutterBottom>
            Ongoing Classes
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Mathematics Class"
                secondary="Teacher: John Doe | Start Time: 10:00 AM | Students: 25"
              />
            </ListItem>
          </List>
        </div>

        <Divider className="my-6" />

        <div className="mt-6">
          <Typography variant="h5" gutterBottom>
            Upcoming Classes
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="History Class"
                secondary="Teacher: Alice Johnson | Start Time: 2:00 PM | Duration: 1 hour"
              />
            </ListItem>
          </List>
        </div>

        <Divider className="my-6" /> 
        <div className="mt-6">
          <Typography variant="h5" gutterBottom>
            Announcements and Notifications
          </Typography>
          {/* Add announcements and notifications options */}
        </div>

        <Divider className="my-6" />

      </Container>
    );
  } else {
    return (
      <PleaseSignIn/>
    );
  }
};

export default HomeView;