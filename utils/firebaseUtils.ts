"use client";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "@/app/firebase"; // Adjust the path as per your project structure
export const fetchBookings = async (uid:string | undefined) => {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(
        query(usersRef, where("uid", "==", uid!))
      );

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return(userData.bookings || [])
      } else {
        console.log("No document found with the provided uid.");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };