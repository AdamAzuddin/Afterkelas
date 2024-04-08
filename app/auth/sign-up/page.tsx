import {db} from "../../../app/firebase"
import React from 'react'

import { collection, addDoc } from "firebase/firestore"; 

async function addUserToFirestore(userData:any) {
  try {
    const docRef = await addDoc(collection(db, "users"), userData);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id; // Return the document ID
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e; // Rethrow the error for handling by the caller
  }
}

// Example usage:
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
  });

const page = () => {
  return (
    <div>page</div>
  )
}

export default page