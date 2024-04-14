"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { db, storage } from "../../../firebase"; // Import storage from firebase
import { getStorage, ref, uploadBytes } from "firebase/storage";
import {
  doc,
  updateDoc,
  arrayUnion,
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

const Page = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/"); // Split the pathname into segments
  const classroomUid = pathSegments[pathSegments.length - 1]; // Access the last segment

  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDescription, setAssignmentDescription] = useState("");
  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [timeSlotError, setTimeSlotError] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State to hold the selected file

  const handleTitleChange = (e: any) => {
    setAssignmentTitle(e.target.value);
  };

  const handleDescriptionChange = (e: any) => {
    setAssignmentDescription(e.target.value);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(dayjs(date)); // Convert formatted date back to Dayjs object
    setSelectedTimeSlot(""); // Reset the selectedTimeSlot when the date changes
    setTimeSlotError(""); // Reset the timeSlotError when the date changes
  };

  const handleTimeSlotChange = (event: SelectChangeEvent<string>) => {
    setSelectedTimeSlot(event.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: any) => {
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

      // Format the selectedDate to yyyy-mm-dd string
      const formattedDate = selectedDate
        ? selectedDate.format("YYYY-MM-DD")
        : "";

      // Upload the selected file to Firebase Storage
      if (selectedFile) {
        const storageInstance = getStorage();
        const fileRef = ref(storageInstance, selectedFile.name);
        await uploadBytes(fileRef, selectedFile);
        const fileUrl = await getDownloadURL(fileRef);
        
        // Update the assignments array in the classroom document
        await updateDoc(classroomDoc.ref, {
          assignments: arrayUnion({
            assignmentId: generateRandomString(28),
            title: assignmentTitle,
            description: assignmentDescription,
            dueDate: formattedDate,
            file: fileUrl, // Assign the file URL
          }),
        });
      } else {
        // Update the assignments array in the classroom document without the file
        await updateDoc(classroomDoc.ref, {
          assignments: arrayUnion({
            assignmentId: generateRandomString(28),
            title: assignmentTitle,
            description: assignmentDescription,
            dueDate: formattedDate,
          }),
        });
      }

      console.log("Assignment updated successfully!");
      window.location.href = '/my-class';
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
        <div style={{ marginBottom: "20px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Choose Due Date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        {/* File input field */}
        <input type="file" onChange={handleFileChange} />
        <Button type="submit" variant="contained" color="primary">
          Update Assignment
        </Button>
      </form>
    </div>
  );
};

export default Page;
