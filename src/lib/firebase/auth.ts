// src/lib/firebase/auth.ts
import { auth, db } from './config';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import type { RegisterInput, LoginInput } from '../../types/auth';

export async function registerUser(input: RegisterInput) {
  const { email, password, fullName, dateOfBirth, bioId } = input;
  
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      fullName,
      dateOfBirth,
      bioId,
      role: 'petitioner',
      createdAt: new Date().toISOString()
    });

    // Get the Firebase ID token
    const token = await userCredential.user.getIdToken();
    
    // Set the session cookie
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export async function loginUser(input: LoginInput) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      input.email,
      input.password
    );

    // Get the Firebase ID token
    const token = await userCredential.user.getIdToken();
    
    // Set the session cookie
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    // Clear the session cookie
    await fetch('/api/auth/session', {
      method: 'DELETE',
    });
  } catch (error) {
    throw error;
  }
}

// Helper function to refresh the session token
export async function refreshSession() {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const token = await currentUser.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
    }
  } catch (error) {
    console.error('Failed to refresh session:', error);
  }
}