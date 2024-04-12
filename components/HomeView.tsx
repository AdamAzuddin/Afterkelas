"use client";
import React from "react";
import { HeaderProps } from "@/utils/interface";
import Link from "next/link";
import {
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const HomeView: React.FC<HeaderProps> = ({ userType }) => {
  if (userType === "student") {
    // Logic to fetch enrolled classrooms, upcoming tutoring sessions, and upcoming assignments goes here
    const enrolledClassrooms: string[] = []; // Replace with actual logic to fetch enrolled classrooms
    const upcomingTutoringSessions: string[] = []; // Replace with actual logic to fetch upcoming tutoring sessions
    const upcomingAssignments: string[] = []; // Replace with actual logic to fetch upcoming assignments

    return (
      <div>
        <Typography variant="h4">Your Classrooms</Typography>
        {enrolledClassrooms.length > 0 ? (
          <>
            <List>
              {enrolledClassrooms.map((classroom, index) => (
                <ListItem key={index}>
                  <ListItemText primary={classroom} />
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
