// helpers/classroomHelpers.ts
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../app/firebase";
import { UserDetails } from "@/utils/interface";

interface EnrolledClassroom {
  teacherName: string;
  classroomUid: string;
}

export const fetchEnrolledClassrooms = async (uid: string): Promise<EnrolledClassroom[]> => {
  try {
    const classroomsRef = collection(db, "classrooms");
    const querySnapshot = await getDocs(
      query(classroomsRef, where("students", "array-contains", uid))
    );

    const enrolledClassrooms: EnrolledClassroom[] = [];
    const namesPromises: Promise<void>[] = [];

    querySnapshot.forEach((doc) => {
      const teacherRef = doc.data().teacher;
      const teacherUid = teacherRef.id;

      const teacherRefBaseUid = collection(db, "users");
      const teacherPromise = getDocs(
        query(teacherRefBaseUid, where("uid", "==", teacherUid))
      ).then((teacherSnapshot) => {
        if (!teacherSnapshot.empty) {
          const teacherData = teacherSnapshot.docs[0].data() as UserDetails;
          const teacherName = teacherData.name;
          const classroomUid = doc.id;
          enrolledClassrooms.push({ teacherName, classroomUid });
        } else {
          console.log("No user document found with the provided uid.");
        }
      });
      namesPromises.push(teacherPromise);
    });

    await Promise.all(namesPromises);
    return enrolledClassrooms;
  } catch (error) {
    console.error("Error fetching enrolled classrooms:", error);
    return [];
  }
};
