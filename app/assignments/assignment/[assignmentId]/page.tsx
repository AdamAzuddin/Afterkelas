"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { db, storage } from "../../../firebase"; // Import storage from firebase
import { getStorage, ref, uploadBytes } from "firebase/storage";
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
import { getDownloadURL } from "firebase/storage";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { SelectChangeEvent } from "@mui/material/Select";
import dayjs, { Dayjs } from "dayjs";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@mui/material";
import { generateRandomString } from "@/utils/generateNewUid";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { UserDetails } from "@/utils/interface";

interface Submission {
  uid: string;
  studentId: string | undefined | null;
  assignmentId: string;
  file: string | undefined | null;
  hasBeenGraded: boolean;
  mark: Number | undefined;
}

interface AssignmentData {
  title: string;
  description: string;
  dueDate: string; // Assuming dueDate is a string
  file: string | undefined | null;
  // Add other properties here if needed
}

// Function to fetch assignment details based on assignment ID
const fetchAssignment = async (assignmentId: any) => {
  try {
    // Find the classroom that contains the assignment with the given ID
    const classroomsRef = collection(db, "classrooms");
    const querySnapshot = await getDocs(classroomsRef);
    let assignmentData = null;

    querySnapshot.forEach((classroomDoc) => {
      const classroomData = classroomDoc.data();
      if (classroomData.assignments) {
        const assignment = classroomData.assignments.find(
          (assignment: any) => assignment.assignmentId === assignmentId
        );
        if (assignment) {
          assignmentData = assignment;
          return; // Exit loop once assignment is found
        }
      }
    });

    if (assignmentData) {
      return assignmentData;
    } else {
      console.log(`Assignment with ID ${assignmentId} does not exist.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return null;
  }
};

const page = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/"); // Split the pathname into segments
  const assignmentId = pathSegments[pathSegments.length - 1]; // Access the last segment
  const [noFileError, setnoFileError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the selected file
  const [user, setUser] = React.useState<User | null>(null);
  const [userUid, setUserUid] = React.useState<string | null>(null);
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(
    null
  ); // Specify AssignmentData as the type of assignmentData

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

          const usersRef = collection(db, "users");
          const querySnapshot = await getDocs(
            query(usersRef, where("uid", "==", user.uid))
          );

          if (!querySnapshot.empty) {
            // Assuming there's only one document with the given uid
            const userData = querySnapshot.docs[0].data() as UserDetails; // Cast to UserDetails
            setUserUid(userData.uid);
          } else {
            console.log("No user document found with the provided uid.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserUid(null); // Reset userType if no user is signed in
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
  const createSubmission = async (submission: Submission) => {
    try {
      const submissionsCollectionRef = collection(db, "submissions");
      await addDoc(submissionsCollectionRef, submission);
      console.log("Submission created successfully!");
    } catch (error) {
      console.error("Error creating submission:", error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      let newSubmission: Submission; // Define newSubmission variable outside the if-else block

      if (selectedFile) {
        const storageInstance = getStorage();
        const fileRef = ref(storageInstance, selectedFile.name);
        await uploadBytes(fileRef, selectedFile);
        const fileUrl = await getDownloadURL(fileRef);
        newSubmission = {
          uid: generateRandomString(28),
          assignmentId: assignmentId,
          studentId: userUid,
          file: fileUrl,
          hasBeenGraded: false,
          mark: 0,
        };

        createSubmission(newSubmission);
        if (typeof window !== "undefined") {
          window.location.href = "/assignments";
        }
      } else {
        setnoFileError("Please select a file");
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
  };

  useEffect(() => {
    // Fetch assignment data when the component mounts
    const fetchData = async () => {
      const data = await fetchAssignment(assignmentId);
      setAssignmentData(data);
    };
    fetchData();
  }, [assignmentId]); // Fetch data whenever assignmentId changes

  return (
    <div>
      <Typography variant="h1">Submit Assignment</Typography>
      {assignmentData ? (
        <div>
          <Typography variant="h2">Title: {assignmentData.title}</Typography>
          <Typography variant="body1">
            Description: {assignmentData.description}
          </Typography>
          <Typography variant="body2">
            Due Date: {assignmentData.dueDate}
          </Typography>
          {assignmentData.file && (
            <Button
              variant="contained"
              color="primary"
              href={assignmentData.file}
              target="_blank"
            >
              View File
            </Button>
          )}
        </div>
      ) : (
        <Typography variant="body1">Loading assignment data...</Typography>
      )}
      <form onSubmit={handleSubmit}>
        {/* File input field */}
        <input type="file" onChange={handleFileChange} />
        {noFileError && (
          <Typography className="text-red-700">{noFileError}</Typography>
        )}
        <Button type="submit" variant="contained" color="primary">
          Submit Assignment
        </Button>
      </form>
    </div>
  );
};

export default page;
