"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
  collection,
  query,
  getDocs,
  where,
} from "firebase/firestore"; // Import arrayUnion
import { db, storage } from "../../../firebase"; // Import storage from firebase
import { Submission } from "@/utils/interface";
import Link from "next/link";
import { Button } from "@mui/material";

const page = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/"); // Split the pathname into segments
  const assignmentId = pathSegments[pathSegments.length - 1]; // Access the last segment
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchSubmissions = async (assignmentId: string) => {
      try {
        // Find the classroom that contains the assignment with the given ID
        const submissionsRef = collection(db, "submissions");
        const submissionQuerySnapshot = await getDocs(
          query(
            submissionsRef,
            where("assignmentId", "==", assignmentId),
            where("hasBeenMarked", "==", false)
          )
        );

        // Create an array to store the submissions
        const newSubmissions: Submission[] = [];

        // Iterate through the submissionQuerySnapshot
        submissionQuerySnapshot.forEach((doc) => {
          // Get the data of each submission
          const submissionData = doc.data();
          // Push the submission data into the newSubmissions array
          newSubmissions.push(submissionData as Submission);
        });

        // Update the state with the newSubmissions array
        setSubmissions(newSubmissions);
        // Get the number of submissions
        const numberOfSubmissions = submissionQuerySnapshot.size;

        console.log("Number of submissions:", numberOfSubmissions);
      } catch (error) {
        console.error("Error fetching assignment:", error);
        return null;
      }
    };

    return () => {
      fetchSubmissions(assignmentId);
    };
  }, [assignmentId]);

  return (
    <div>
      {submissions.map((submission, index) => (
        <div key={index}>
          <p>Submission {index + 1}</p>
          <p>Student ID: {submission.studentId}</p>
          <Button
            variant="contained"
            color="primary"
            href={`/assignments/submission/${assignmentId}/${submission.uid}`}
          >
            View submission
          </Button>
          {/* Add more details as needed */}
        </div>
      ))}
    </div>
  );
};

export default page;
