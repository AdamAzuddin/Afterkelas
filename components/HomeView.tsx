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
import { fetchEnrolledClassrooms } from "../utils/classroomHelpers";
import ClassroomListItem from "./ClassroomListCard";

const HomeView: React.FC<HeaderProps> = ({ userType, uid }) => {
  const upcomingTutoringSessions: string[] = []; // Replace with actual logic to fetch upcoming tutoring sessions
  const upcomingAssignments: string[] = []; // Replace with actual logic to fetch upcoming assignments
  const [teachersName, setTeachersName] = useState<string[]>([]);
  const [enrolledClassrooms, setEnrolledClassrooms] = useState<
    { teacherName: string; classroomUid: string }[]
  >([]);

  useEffect(() => {
    if (userType === "student") {
      fetchEnrolledClassrooms(uid).then((enrolledClassrooms) => {
        setTeachersName(
          enrolledClassrooms.map(({ teacherName }) => teacherName)
        );
        setEnrolledClassrooms(enrolledClassrooms);
      });
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
            <List className="flex mx-5">
              {enrolledClassrooms.map((classroom, index) => (
                <ClassroomListItem
                  key={index}
                  teacherName={classroom.teacherName}
                  classroomUid={classroom.classroomUid}
                />
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
