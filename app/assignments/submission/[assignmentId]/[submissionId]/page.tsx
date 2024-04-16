"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Submission } from "@/utils/interface";
import {
  doc,
  updateDoc,
  arrayUnion,
  addDoc,
  collection,
  query,
  getDocs,
  where,
  DocumentData,
} from "firebase/firestore"; // Import arrayUnion
import { db, storage } from "@/app/firebase"; // Import storage from firebase
import { Paper, Typography, Button, TextField } from "@mui/material";

const page = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/"); // Split the pathname into segments
  const submissionId = pathSegments[pathSegments.length - 1]; // Access the last segment
  const [submission, setSubmission] = useState<DocumentData>();
  const fetchSubmission = async (submissionId: string) => {
    try {
      const submissionsRef = collection(db, "submissions");
      const submissionQuerySnapshot = await getDocs(
        query(submissionsRef, where("uid", "==", submissionId))
      );
      const submission = submissionQuerySnapshot.docs[0].data();
      console.log(submission.assignmentId);
      setSubmission(submission);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      return null;
    }
  };

  const handleReturnSubmission = async () => {};

  const handleChangeGrade = async () => {};

  fetchSubmission(submissionId);
  return (
    <Paper elevation={3} style={{ padding: "20px", marginBottom: "10px" }}>
      <div>
        <Typography variant="h6">Submission: {submission?.uid}</Typography>
        <Typography>Student ID: {submission?.studentId}</Typography>
        <Typography>Assignment ID: {submission?.assignmentId}</Typography>
        <Typography>
          Has Been Graded: {submission?.hasBeenGraded ? "Yes" : "No"}
        </Typography>
        {submission?.hasBeenGraded && (
          <>
            <Typography>Mark: {submission.mark}</Typography>
            <Typography>Marked File: {submission.markedFile}</Typography>
          </>
        )}
        <div>
          <Button
            variant="contained"
            color="primary"
            href={submission?.file}
            target="_blank"
            style={{ marginBottom: "10px" }}
          >
            View Submitted File
          </Button>
        </div>
        <div>
          <TextField
            type="number"
            label="Grade"
            variant="outlined"
            style={{ marginBottom: "10px" }}
            onChange={handleChangeGrade}
            inputProps={{ min: 0 }}
          />
        </div>
        <div>
          <Button
            variant="contained"
            component="label"
            style={{ marginBottom: "10px" }}
          >
            Upload Marked File
            <input type="file" hidden />
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleReturnSubmission()}
            style={{ marginBottom: "10px" }}
          >
            Return Submission
          </Button>
        </div>
      </div>
    </Paper>
  );
};

export default page;
