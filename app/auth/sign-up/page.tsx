"use client"

import { db } from "../../../app/firebase";
import React from "react";

import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

async function addUserToFirestore(userData: any) {
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the document ID
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // Rethrow the error for handling by the caller
  }
}

/* // Example usage:
const userData = {
  first: "Adam",
  last: "Lovelace",
  born: 1815
};

addUserToFirestore(userData)
  .then(() => {
    console.log("User added successfully!");
  })
  .catch((error) => {
    console.error("Error adding user:", error);
  }); */
const SignUpPage = () => {
  const [name, setName] = useState("");
  const [userType, setUserType] = useState("student");

  const handleSignUp = async () => {
    try {
      // Check if the name already exists
      const nameExistsQuery = query(
        collection(db, "users"),
        where("name", "==", name)
      );
      const nameExistsSnapshot = await getDocs(nameExistsQuery);
      if (!nameExistsSnapshot.empty) {
        console.log("Name already exists");
        return;
      }

      // Add user to Firestore
      const userData = {
        name: name,
        userType: userType,
        assignedTeacher: [],
        // Add other fields as needed
      };
      const docRef = await addDoc(collection(db, "users"), userData);
      console.log("User added successfully with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4 space-y-4 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-semibold text-center">Sign Up</h1>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          select
          label="User Type"
          variant="outlined"
          fullWidth
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSignUp}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
};

export default SignUpPage;
