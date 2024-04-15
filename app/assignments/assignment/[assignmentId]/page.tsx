"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@mui/material";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"; // Import arrayUnion
import { db, storage } from "../../../firebase"; // Import storage from firebase
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";

const page = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/"); // Split the pathname into segments
  const assignmentId = pathSegments[pathSegments.length - 1]; // Access the last segment
  const [user, setUser] = React.useState<User | null>(null);
  const [userUid, setUserUid] = useState("");
  const [classroomUid, setClassroomUid] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the selected file

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setUser(user);
      if (user) {
        try {
          if (!db) {
            console.error("Firebase is not initialized.");
            return;
          }

          setUserUid(user.uid);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserUid("");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("USer uid on assignment page: ", userUid)
    try {
      // Check if a file is selected
      if (selectedFile) {
        // Upload the selected file to Firebase Storage
        const storageInstance = getStorage();
        const fileRef = ref(storageInstance, selectedFile.name);
        await uploadBytes(fileRef, selectedFile);
        const fileUrl = await getDownloadURL(fileRef);

        // Get the assignment document from Firestore
        const assignmentRef = doc(
          db,
          "classrooms",
          //TODO: Get classroom uid
          "YOUR_CLASSROOM_ID",
          "assignments",
          assignmentId
        );
        const assignmentDoc = await getDoc(assignmentRef);

        if (assignmentDoc.exists()) {
          // Update the assignment document in Firestore with the file URL
          await updateDoc(assignmentRef, {
            file: fileUrl, // Update the file field with the file URL
            submissions: arrayUnion({
              studentUid: userUid,
              hasSubmitted: true,
              fileSubmission: fileUrl,
            }), // Update the submissions array with the student's submission
          });
        } else {
          console.error("Assignment document does not exist.");
        }
      } else {
        // No file selected, only update the hasSubmitted field

        // Get the assignment document from Firestore
        const assignmentRef = doc(
          db,
          "classrooms",
          "YOUR_CLASSROOM_ID",
          "assignments",
          assignmentId
        );
        const assignmentDoc = await getDoc(assignmentRef);

        if (assignmentDoc.exists()) {
          // Update the assignment document in Firestore with hasSubmitted field
          await updateDoc(assignmentRef, {
            submissions: arrayUnion({
              studentUid: userUid,
              hasSubmitted: true,
            }), // Update the submissions array with the student's hasSubmitted field
          });
        } else {
          console.error("Assignment document does not exist.");
        }
      }

      console.log("Assignment updated successfully!");
      if (typeof window !== "undefined") {
        window.location.href = "/assignments";
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  return (
    <div>
      {user && (
        <div>
          <h1>{assignmentId}</h1>
          <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <Button type="submit" variant="contained" color="primary">
              Update Assignment
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default page;
