"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { db } from "../../../firebase";
import { doc, updateDoc, arrayUnion,collection,query, getDocs, where } from "firebase/firestore"; // Import arrayUnion
import { Typography, TextField, Button } from "@mui/material";

const Page = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/"); // Split the pathname into segments
  const classroomUid = pathSegments[pathSegments.length - 1]; // Access the last segment

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");

  const handleTitleChange = (e:any) => {
    setAssignmentTitle(e.target.value);
  };

  const handleDescriptionChange = (e:any) => {
    setAssignmentDescription(e.target.value);
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      // Get a reference to the classrooms collection
      const classroomsCollectionRef = collection(db, "classrooms");

      // Query for the classroom document with the specified uid
      const querySnapshot = await getDocs(
        query(classroomsCollectionRef, where("uid", "==", classroomUid))
      );

      // Get the first document matching the query
      const classroomDoc = querySnapshot.docs[0];

      // Update the assignments array in the classroom document
      await updateDoc(classroomDoc.ref, {
        assignments: arrayUnion({
          title: assignmentTitle,
          description: assignmentDescription
        })
      });

      console.log("Assignment updated successfully!");
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  useEffect(() => {
    // Fetch assignment data here and set the state
  }, []);

  return (
    <div>
      <Typography variant="h1">Edit Assignment</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          type="text"
          value={assignmentTitle}
          onChange={handleTitleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          value={assignmentDescription}
          onChange={handleDescriptionChange}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Update Assignment
        </Button>
      </form>
    </div>
  );
};

export default Page;
