// helpers/classroomHelpers.ts
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../app/firebase";
import { UserDetails } from "@/utils/interface";

export const fetchEnrolledClassrooms = async (uid: string) => {
  try {
    const classroomsRef = collection(db, "classrooms");
    const querySnapshot = await getDocs(
      query(classroomsRef, where("students", "array-contains", uid))
    );

    const classrooms: string[] = [];
    const namesPromises: Promise<string>[] = [];

    querySnapshot.forEach((doc) => {
      const teacherRef = doc.data().teacher;
      const teacherUid = teacherRef.id;

      const teacherRefBaseUid = collection(db, "users");
      const teacherPromise = getDocs(
        query(teacherRefBaseUid, where("uid", "==", teacherUid))
      ).then((teacherSnapshot) => {
        if (!teacherSnapshot.empty) {
          const teacherData = teacherSnapshot.docs[0].data() as UserDetails;
          return teacherData.name;
        } else {
          console.log("No user document found with the provided uid.");
          return ""; // Return an empty string if no user found
        }
      });
      namesPromises.push(teacherPromise);
    });

    const teacherNames = await Promise.all(namesPromises);
    return teacherNames.filter((name) => name !== "");
  } catch (error) {
    console.error("Error fetching enrolled classrooms:", error);
    return [];
  }
};
