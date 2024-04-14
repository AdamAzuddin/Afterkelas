"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { db } from "../../../firebase";
import {
  getDocs,
  query,
  collection,
  where,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import dayjs, { Dayjs } from "dayjs";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { SelectChangeEvent } from "@mui/material/Select";
import { studentData } from "@/utils/data";
interface TeacherDetails {
  name: String;
  subject: String;
}

const Page = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/"); // Split the pathname into segments
  const teacherId = pathSegments[pathSegments.length - 1]; // Access the last segment
  const [teacherDetails, setTeacherDetails] = useState<TeacherDetails | null>(
    null
  );

  const [selectedDate, setSelectedDate] = React.useState<Dayjs | null>(dayjs());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [timeSlotError, setTimeSlotError] = useState<string>("");
  const [user, setUser] = React.useState<User | null>(null);
  const [bookingError, setBookingError] = useState<string>("");

  // Function to handle date selection
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date ? dayjs(date) : null); // Convert Date to Dayjs object
    setSelectedTimeSlot(""); // Reset the selectedTimeSlot when the date changes
    setTimeSlotError(""); // Reset the timeSlotError when the date changes
  };

  // Function to handle time slot selection
  const handleTimeSlotChange = (event: SelectChangeEvent<string>) => {
    setSelectedTimeSlot(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (event: any) => {
    event.preventDefault(); // Prevent default form submission behavior
    setBookingError("");

    if (selectedDate && selectedTimeSlot) {
      // Parse the selected time slot to extract the start and end times
      const [startTime, endTime] = selectedTimeSlot.split(" - ");

      // Get the selected date and time in Malaysia timezone
      const selectedDateTime = selectedDate.hour(
        Number(startTime.split(":")[0]) + 8
      ); // Add 8 hours for Malaysia timezone
      selectedDateTime.minute(Number(startTime.split(":")[1]));

      // Format the selected date in ISO 8601 format
      const isoDate = selectedDateTime.format("YYYY-MM-DD");

      console.log("Booking submitted:", isoDate);

      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const usersRef = collection(db, "users");

          // Fetch user document
          const userQuerySnapshot = await getDocs(
            query(usersRef, where("uid", "==", user.uid))
          );

          if (!userQuerySnapshot.empty) {
            const userDoc = userQuerySnapshot.docs[0];
            const userDocData = userDoc.data();
            const userUid = userDocData.uid;
            const userName = userDocData.name; // Retrieve user name
            const userType = userDocData.type; // Retrieve user type

            // Check if the user already has a booking on the same date and time
            const existingBooking = userDocData.bookings?.find(
              (booking: any) =>
                booking.date === isoDate &&
                booking.timeSlot === selectedTimeSlot
            );

            if (existingBooking) {
              setBookingError("You already have a booking for this time slot.");
              return; // Exit function
            }

            const teacherQuerySnapshot = await getDocs(
              query(usersRef, where("uid", "==", teacherId))
            );

            if (!teacherQuerySnapshot.empty) {
              const teacherDoc = teacherQuerySnapshot.docs[0];
              const teacherDocData = teacherDoc.data();
              const teacherName = teacherDocData.name; // Retrieve teacher name
              // Update user document
              await updateDoc(userDoc.ref, {
                bookings: [
                  ...(userDocData.bookings || []),
                  {
                    date: isoDate,
                    timeSlot: selectedTimeSlot,
                    teacherId: userType === "student" ? teacherId : userUid, // Set teacherId for student and userUid for teacher
                    teacherName: teacherName, //
                    studentId: userType === "student" ? userUid : teacherId, // Set studentId for teacher and userUid for student
                  },
                ],
              });
            }
            

            console.log("User booking updated successfully.");
            if (!teacherQuerySnapshot.empty) {
              const teacherDoc = teacherQuerySnapshot.docs[0];
              const teacherDocData = teacherDoc.data();
              const teacherName = teacherDocData.name; // Retrieve teacher name

              // Update teacher document
              await updateDoc(teacherDoc.ref, {
                bookings: [
                  ...(teacherDocData.bookings || []),
                  {
                    date: isoDate,
                    timeSlot: selectedTimeSlot,
                    studentId: userUid,
                    studentName: userName, // Add student name to the booking
                  },
                ],
              });

              const classroomsRef = collection(db,"classrooms"); 
              const classroomsQuerySnapshot = await getDocs(query(classroomsRef, where("teacher","==", teacherId)));
              if (!classroomsQuerySnapshot.empty){
                const classroomDoc = classroomsQuerySnapshot.docs[0];
                const classroomDocData = classroomDoc.data();

                await updateDoc(classroomDoc.ref, {
                  students: [
                    ...(classroomDocData.students || []),
                    {
                      studentUid: userUid,
                      studentName: userName
                    }
                  ]
                })
              }

              console.log("Teacher booking updated successfully.");
              //TODO: Update student uid to students array in classroom collection doc
              //TODO: Send confirmation email to student and teacher
              //TODO: Send success toas
              if (typeof window !== "undefined") {window.location.href = '/'};
            } else {
              console.error("Teacher document not found.");
            }
          } else {
            console.error("User document not found.");
          }
        } else {
          console.error("User not logged in.");
        }
      } catch (error) {
        console.error("Error updating booking:", error);
      }
    } else {
      console.error("Please select both date and time slot.");
    }
  };

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
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      try {
        if (!db) {
          console.error("Firebase is not initialized.");
          return;
        }

        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(
          query(usersRef, where("uid", "==", teacherId))
        );

        if (!querySnapshot.empty) {
          // Assuming there's only one document with the given teacherId
          const userData = querySnapshot.docs[0].data() as TeacherDetails; // Assuming TeacherDetails is the type of your user document
          setTeacherDetails(userData);
        } else {
          console.log("No teacher document found with the provided teacherId.");
        }
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    };

    fetchTeacherDetails();
  }, [teacherId]);

  return (
    <div>
      <Typography variant="h4">
        Book a Tutoring Session with Teacher {teacherDetails?.name}
      </Typography>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Choose a date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div>
          <FormControl fullWidth>
            <InputLabel>Time Slot</InputLabel>
            <Select value={selectedTimeSlot} onChange={handleTimeSlotChange}>
              <MenuItem value="9:00am - 11:00am">9:00am - 11:00am</MenuItem>
              <MenuItem value="11:00am - 1:00pm">11:00am - 1:00pm</MenuItem>
              <MenuItem value="3:00pm - 5:00pm">3:00pm - 5:00pm</MenuItem>
              <MenuItem value="5:00pm - 7:00pm">5:00pm - 7:00pm</MenuItem>
              <MenuItem value="8:30pm - 10:30pm">8:30pm - 10:30pm</MenuItem>
            </Select>
          </FormControl>
        </div>
        {bookingError && <Typography color="error">{bookingError}</Typography>}

        <Button type="submit" variant="contained" color="primary">
          Book Session
        </Button>
      </form>
    </div>
  );
};

export default Page;
