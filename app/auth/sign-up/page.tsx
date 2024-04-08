"use client"
// pages/signup.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc } from 'firebase/firestore'; // Import the doc method
import { auth, db } from '../../firebase';

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [userType, setUserType] = useState('student'); // Default to student
  const [subjectId, setSubjectId] = useState<string | null>(null); // Subject document ID

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Sign up user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Proceed to add additional information to Firestore
      await addUserToFirestore(user.uid);

      console.log('User signed up and added to Firestore successfully');
      router.push('/profile'); // Redirect to profile page after sign up
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const addUserToFirestore = async (userId: string) => {
    try {
      let userData: any = {
        name,
        userType
      };

      if (userType === 'student') {
        userData.assignedTeacher = [];
      } else if (userType === 'teacher' && subjectId) {
        userData.subject = doc(db, `subjects/${subjectId}`); // Corrected reference to Firestore document
      }

      await addDoc(collection(db, 'users'), {
        uid: userId,
        ...userData
      });
    } catch (error) {
      console.error('Error adding user to Firestore:', error);
      throw error;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
          <select value={userType} onChange={(e) => setUserType(e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          {userType === 'teacher' && (
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select id="subject" value={subjectId ?? ''} onChange={(e) => setSubjectId(e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select subject</option>
                <option value="NeaHIzElfLyho6kwyWim">Math</option>
                <option value="RDvg0cfcQcr429p5s9bC">Physics</option>
                <option value="eoydg38qVigYTy4gkK17">Chemistry</option>
                <option value="mLPMZ0iqSJVGgaRYEQRW">Biology</option>
              </select>
            </div>
          )}
          <button type="submit" className="block w-full bg-blue-500 text-white rounded-md py-2">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
