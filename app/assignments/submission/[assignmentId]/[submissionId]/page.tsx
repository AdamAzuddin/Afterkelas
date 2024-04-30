"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Submission } from "@/utils/interface";
import {
  doc,
  updateDoc,
  collection,
  query,
  getDocs,
  where,
  DocumentData,
} from "firebase/firestore"; // Import arrayUnion
import { db} from "@/app/firebase"; // Import storage from firebase
import { Paper, Typography, Button, TextField } from "@mui/material";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";

const page = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/"); // Split the pathname into segments
  const submissionId = pathSegments[pathSegments.length - 1]; // Access the last segment
  const [submission, setSubmission] = useState<DocumentData>();
  const [mark, setMark] = useState<Number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the selected file

  useEffect(() => {
    const fetchSubmission = async (submissionId: string) => {
      try {
        const submissionsRef = collection(db, "submissions");
        const submissionQuerySnapshot = await getDocs(
          query(
            submissionsRef,
            where("uid", "==", submissionId)
          )
        );
        const submission = submissionQuerySnapshot.docs[0].data();
        setSubmission(submission);
      } catch (error) {
        console.error("Error fetching assignment:", error);
        return null;
      }
    };
  
    return () => {
      fetchSubmission(submissionId)
    }
  }, [submissionId])

  const handleReturnSubmission = async () => {
    try {
      const uid = submission?.uid;
      const submissionsRef = collection(db, "submissions");
      const submissionQuerySnapshot = await getDocs(
        query(submissionsRef, where("uid", "==", uid))
      );
      const storageInstance = getStorage();
      const fileRef = ref(storageInstance, selectedFile?.name);
      await uploadBytes(fileRef, selectedFile!);
      const fileUrl = await getDownloadURL(fileRef);

      if (!submissionQuerySnapshot.empty) {
        const submissionDocRef = doc(
          db,
          "submissions",
          submissionQuerySnapshot.docs[0].id
        );
        await updateDoc(submissionDocRef, {
          hasBeenGraded: true,
          mark: mark,
          markedFile: fileUrl,
        });

        console.log("Submission returned successfully!");
        if (typeof window !== "undefined") {
          window.history.back();
        }
      } else {
        console.log("Submission not found.");
      }
    } catch (error) {
      console.error("Error updating mark:", error);
    }
  };

  const handleChangeGrade = async (e: any) => {
    const newMark = e.target.value; // Get the new mark value from the event
    setMark(newMark); // Update the state with the new mark value
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
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
            inputProps={{ min: 0 , max: 100}}
          />
        </div>
        <div>
          <input type="file" onChange={handleFileChange} />
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
