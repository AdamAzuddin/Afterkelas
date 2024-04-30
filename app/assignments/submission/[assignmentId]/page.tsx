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
        const submissionsRef = collection(db, "submissions");
        const submissionQuerySnapshot = await getDocs(
          query(
            submissionsRef,
            where("assignmentId", "==", assignmentId),
            where("hasBeenGraded", "==", false)
          )
        );
        if (!submissionQuerySnapshot.empty) {
          const newSubmissions: Submission[] = [];
          submissionQuerySnapshot.forEach((doc) => {
            const submissionData = doc.data();
            newSubmissions.push(submissionData as Submission);
          });

          setSubmissions(newSubmissions);
        } else {
          console.log("No submissions found");
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    fetchSubmissions(assignmentId);
  }, [assignmentId]);

  return (
    <div>
      {submissions.length === 0 ? (
        <p>No one has submitted this assignment yet</p>
      ) : (
        submissions.map((submission, index) => (
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
        ))
      )}
    </div>
  );
};

export default page;
