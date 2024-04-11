"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { db } from "../../../firebase";
import { getDocs, query, collection, where, doc } from "firebase/firestore";

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

  return <div>{teacherDetails?.name}</div>;
};

export default Page;
