"use client";
import React, { useEffect } from "react";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { usePathname } from "next/navigation";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { BookingProps, UserDetails } from "@/utils/interface";
import { Button } from "@mui/material";

interface BookingDetailsProps {
  bookingId: string;
  userId: string;
}

const page: React.FC<BookingDetailsProps> = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/"); // Split the pathname into segments
  const bookingId = pathSegments[pathSegments.length - 1]; // Access the last segment

  const [user, setUser] = React.useState<any>(null);
  const [userType, setUserType] = React.useState<string | null>(null);
  const [bookings, setBookings] = React.useState<BookingProps[] | []>([]);

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
            setUser(userData),
            setUserType(userData.userType);
            setBookings(userData.bookings);
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


  //TODO(Aeyman): Complete this function. First find the booking, check if number of reschedule exceeded limit (3), if yes don't allow, if no submit reschedule request to admin
  const rescheduleBooking = () => {};


  const markAttendance = async () => {
    const updatedBookings = bookings.map((booking) => {
      if (booking.bookingId === bookingId) {
        return { ...booking, hasBeenCompleted: true };
      }
      return booking;
    });

    setBookings(updatedBookings);

    try {
      const userQuerySnapshot = await getDocs(
        query(collection(db, "users"), where("uid", "==", user?.uid))
      );
      
      if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0];
        const userDocRef = doc(db, "users", userDoc.id); // Use the document ID
        await updateDoc(userDocRef, { bookings: updatedBookings });
        console.log("Attendance marked successfully!");
      } else {
        console.error("No user document found with the provided uid.");
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  return (
    <div>
      <h1>Booking Details</h1>
      {bookings.length > 0 && (
        <div>
          {bookings.map((booking) => {
            if (booking.bookingId === bookingId) {
              return (
                <div key={booking.bookingId}>
                  <p>Booking ID: {booking.bookingId}</p>
                  <p>Date: {booking.date}</p>
                  <p>Time Slot: {booking.timeSlot}</p>
                  {userType=="student" && <p>Teacher Name: {booking.teacherName}</p>}
                  {userType=="teacher" && <p>Student Name: {booking.studentName}</p>}
                  <Button onClick={markAttendance}>Completed</Button>
                  <Button onClick={rescheduleBooking}>Reschedule</Button>
                  {/* Add more details if needed */}
                </div>
              );
            }
            return null; // If bookingId doesn't match, return null
          })}
        </div>
      )}
    </div>
  );
  
};

export default page;
