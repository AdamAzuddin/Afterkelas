import React, { useEffect} from "react";
import { collection , getDocs, query, where} from "firebase/firestore";
import { db } from "@/app/firebase";

interface BookingDetailsProps {
    bookingId: string;
    userId: string;
}

const BookingDetails: React.FC<any> = ({bookingId, userId}) => {
  useEffect(() => {
    const fetchBooking = async() => {
      const bookingRef = collection(db, "users");
      // Fetch user document
      const bookingQuerySnapshot = await getDocs(
        query(bookingRef, where("uid", "==", userId))
      );

      if (!bookingQuerySnapshot.empty){
        const bookingDoc = bookingQuerySnapshot.docs[0];
        const userDocData = bookingDoc.data();
      }
    };

    return () => {
      fetchBooking();
    };
  }, []);

  return <div>BookingDetails</div>;
};

export default BookingDetails;
