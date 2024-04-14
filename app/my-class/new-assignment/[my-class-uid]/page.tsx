"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { db } from "../../../firebase";
import { getDocs, query, collection, where, doc } from "firebase/firestore";
import { Classroom } from "@/utils/interface";
//TODO: Move show assignment to my class page (the fx is almost complete)
const page = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/"); // Split the pathname into segments
  const classroomUid = pathSegments[pathSegments.length - 1]; // Access the last segment
  const [assignmentDetails, setAssignmentDetails] = useState<Classroom>();

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      try {
        if (!db) {
          console.error("Firebase is not initialized.");
          return;
        }

        const classroomRef = collection(db, "classrooms");
        const querySnapshot = await getDocs(query(classroomRef, where("uid", "==", classroomUid)))

        if (!querySnapshot.empty) {
          const classroomData = querySnapshot.docs[0].data();
          console.log(classroomData?.assignments) 
          setAssignmentDetails(classroomData?.assignments);
        } else {
          console.log("No teacher document found with the provided teacherId.");
        }
      } catch (error) {
        console.error("Error fetching teacher details:", error);
      }
    };

    fetchAssignmentDetails();
  }, [assignmentDetails]);

  return <div></div>;
};

export default page;
