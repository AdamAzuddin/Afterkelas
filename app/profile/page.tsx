"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../app/firebase";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const Profile = () => {
  const [user, loading, error] = useAuthState(auth);
  const [userType, setUserType] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const q = query(collection(db, "users"), where("email", "==", user.email));
          const userSnapshot = await getDocs(q);
          if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            const userType = userData.userType || "Unknown";
            setUserType(userType);
          } else {
            console.error("User data not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      {loading && <Typography variant="h6">Loading...</Typography>}
      {error && <Typography variant="h6">Error: {error.message}</Typography>}
      {user ? (
        <div>
          <Typography variant="h4" gutterBottom>
            Welcome, {user.displayName || "User"}
          </Typography>
          <Typography variant="h6" gutterBottom>
            Email: {user.email}
          </Typography>
          <Typography variant="h6" gutterBottom>
            User Type: {userType}
          </Typography>
          <Button variant="contained" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      ) : (
        <div>
          <Typography variant="h6">
            Please sign in to view your profile.
          </Typography>
          <Button variant="contained" onClick={() => router.push('/auth/sign-in')}>Sign In</Button>
        </div>
      )}
    </Container>
  );
};

export default Profile;
