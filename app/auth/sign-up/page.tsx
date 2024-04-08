"use client";

// pages/signup.tsx
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "next/link";
import Typography from "@mui/material/Typography";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("student"); // Default to student
  const [subjectId, setSubjectId] = useState<string | null>(null); // Subject document ID

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Sign up user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Proceed to add additional information to Firestore
      await addUserToFirestore(user.uid);

      console.log("User signed up and added to Firestore successfully");
      router.push("/profile"); // Redirect to profile page after sign up
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const addUserToFirestore = async (userId: string) => {
    try {
      let userData: any = {
        name,
        userType,
        email,
      };

      if (userType === "student") {
        userData.assignedTeacher = [];
      } else if (userType === "teacher" && subjectId) {
        userData.subject = doc(db, `subjects/${subjectId}`); // Corrected reference to Firestore document
      }

      await addDoc(collection(db, "users"), {
        uid: userId,
        ...userData,
      });
    } catch (error) {
      console.error("Error adding user to Firestore:", error);
      throw error;
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 className="text-4xl">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
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
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>User Type</InputLabel>
            <Select
              value={userType}
              onChange={(e) => setUserType(e.target.value as string)}
              label="User Type"
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          {userType === "teacher" && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel>Subject</InputLabel>
              <Select
                value={subjectId ?? ""}
                onChange={(e) => setSubjectId(e.target.value as string)}
                label="Subject"
              >
                <MenuItem value="">Select subject</MenuItem>
                <MenuItem value="math">Math</MenuItem>
                <MenuItem value="bio">Biology</MenuItem>
                <MenuItem value="chem">Chemistry</MenuItem>
                <MenuItem value="phy">Physics</MenuItem>
              </Select>
            </FormControl>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </form>
        <Box mt={2} textAlign="center">
          Already signed up?{" "}
          <Link href="/auth/sign-in">
            <Typography
              color="primary"
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Sign in
            </Typography>
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
