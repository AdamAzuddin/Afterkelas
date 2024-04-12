"use client";

import { Header, HomeView, SideLayout } from "@/components";
import React from "react";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../app/firebase"; // Adjust the path as per your project structure
import { UserDetails } from "@/utils/interface";
//TODO: pass userDetails as props

const Home = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [userType, setUserType] = React.useState<string | null>(null);

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
  console.log(userType);
  console.log(user?.uid)

  return (
    <SideLayout>
      <Header />
      <HomeView userType={userType} uid={user?.uid} />
    </SideLayout>
  );
};

export default Home;
