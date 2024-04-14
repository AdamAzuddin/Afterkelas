"use client"
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../../app/firebase";
import { UserDetails } from "@/utils/interface";
import Assignments from "@/components/Assignments";

const AssignmentPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

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
  return (
    <div>
      {userType === "student" && (
        <div>
          <Assignments userType={"student"} uid={user?.uid}/>
          {/* Content for students */}
        </div>
      )}
      {userType === "teacher" && (
        <div>
          <h2>Welcome, Teacher!</h2>
          {/* Content for teachers */}
        </div>
      )}
      {userType === "admin" && (
        <div>
          <h2>Welcome, Admin!</h2>
          {/* Content for admins */}
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;
