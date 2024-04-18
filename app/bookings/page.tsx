"use client";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "@/app/firebase"; // Adjust the path as per your project structure
import { UserDetails } from "@/utils/interface";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import BookingDetails from "@/components/BookingDetails";
import Link from "next/link";
//TODO: Setup this page
const page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userUid, setuserUid] = useState<string>();
  const [userType, setUserType] = useState<string | null>(null);
  const [bookings, setBookings] = useState<[]>([]);

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
            setUserType(userData.userType);
            setuserUid(userData.uid);
          } else {
            console.log("No user document found with the provided uid.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserType(null); // Reset userType if no user is signed in
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!userUid) {
          console.log("User UID is not available.");
          return;
        }

        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(
          query(usersRef, where("uid", "==", userUid))
        );

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setBookings(userData.bookings || []);
        } else {
          console.log("No document found with the provided uid.");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [userUid]);

  return (
    <div>
      <div style={{ marginTop: "20px" }}>
        <Typography variant="h4">Upcoming Tutoring Sessions:</Typography>
        {bookings.length > 0 ? (
          <List>
            {bookings.map((booking: any, index: any) => (
              <ListItem key={index}>
                {userType == "teacher" && (
                  <div>
                    <ListItemText
                      primary={`Date: ${booking.date}, Time Slot: ${booking.timeSlot}, Booking Id: ${booking.bookingId}`}
                      secondary={`With student: ${booking.studentName}`}
                    />
                    <Button href={`/bookings/${booking.bookingId}`}>
                      View my booking
                    </Button>
                  </div>
                )}
                {userType == "student" && (
                  <div>
                    <ListItemText
                      primary={`Date: ${booking.date}, Time Slot: ${booking.timeSlot}, Booking Id: ${booking.bookingId}`}
                      secondary={`With Teacher: ${booking.teacherName}`}
                    />
                    <Button href={`/bookings/${booking.bookingId}`}>
                      View my booking
                    </Button>
                  </div>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1">No bookings available</Typography>
        )}
      </div>
    </div>
  );
};

export default page;
