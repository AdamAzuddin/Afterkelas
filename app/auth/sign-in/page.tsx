"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "next/link";
import { db } from "../../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Image from "next/image";
import afterkelasLogo from "@/assets/afterkelas_logo.jpg";
import profileImg from "@/assets/profile_img.jpg";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isClient, setIsClient] = useState(false); // State to track client-side rendering

  // useEffect to set isClient to true when component is mounted
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Sign in user with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user data from Firestore based on email
      const q = query(collection(db, "users"), where("email", "==", email));
      const userSnapshot = await getDocs(q);
      if (!userSnapshot.empty) {
        // Get the user document data
        const userData = userSnapshot.docs[0].data();
        // Determine the redirect route based on user type from Firestore
        let redirectRoute = "/"; // Default route
        const userType = userData.userType; // Assuming userType is a field in the user document
        console.log("User signed in successfully");
        router.push(redirectRoute); // Redirect to appropriate route after sign in
      } else {
        console.error("User data not found in Firestore");
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      {isClient && ( // Render content only on the client side
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 className="text-4xl mb-2">Sign In</h1>
          <Image
            src={afterkelasLogo}
            alt="Afterkelas logo"
            width={600}
            height={15}
          />
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-black m-4">
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <Image
                src={profileImg}
                alt="Profile Photo"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </div>
          <form onSubmit={handleSignIn} className="space-y-4">
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign In
            </Button>
          </form>
          <Box mt={2} textAlign="center">
            Don't have an account?{" "}
            <Link href="/auth/sign-up">
              <span
                style={{
                  color: "blue",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Sign up
              </span>
            </Link>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default SignIn;
