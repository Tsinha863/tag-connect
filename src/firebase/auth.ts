'use client';

import {
  Auth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

export async function signInWithGoogle(auth: Auth, firestore: Firestore) {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  // Check if user profile exists
  const userProfileRef = doc(firestore, 'users', user.uid);
  const userProfileSnap = await getDoc(userProfileRef);

  if (!userProfileSnap.exists()) {
    // This is a new user, create a profile.
    // Defaulting to 'student' role. App should guide user to confirm/change role if necessary.
    const newUserProfile = {
      id: user.uid,
      name: user.displayName || 'Anonymous',
      email: user.email!,
      phone: user.phoneNumber || '',
      role: 'student', 
      createdAt: serverTimestamp(),
    };
    await setDoc(userProfileRef, newUserProfile);
    
    // Create a default student profile since it's the default role
    const studentProfileRef = doc(firestore, 'studentProfiles', user.uid);
    await setDoc(studentProfileRef, {
        id: user.uid,
        email: user.email!,
        fullName: user.displayName || 'Anonymous',
        education: '',
        stream: '',
        skills: [],
        experienceYears: 0,
        city: '',
        state: '',
        jobType: 'Full-time',
        verified: false,
        profileCompletionPercentage: 10,
        searchKeywords: [(user.displayName || 'Anonymous').toLowerCase(), (user.email || '').toLowerCase()],
        createdAt: serverTimestamp(),
    });
  }

  return userCredential;
}


export async function signUpWithEmail(
  auth: Auth,
  firestore: Firestore,
  data: any
) {
    const { email, password, fullName, role } = data;
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile = {
        id: user.uid,
        name: fullName,
        email: user.email!,
        phone: '',
        role: role,
        createdAt: serverTimestamp(),
    };
    await setDoc(doc(firestore, 'users', user.uid), userProfile);
    
    if (role === 'student') {
        const studentProfile = {
            id: user.uid,
            email: email,
            fullName: fullName,
            education: '',
            stream: '',
            skills: [],
            experienceYears: 0,
            city: '',
            state: '',
            jobType: 'Full-time',
            verified: false,
            profileCompletionPercentage: 10,
            searchKeywords: [fullName.toLowerCase(), email.toLowerCase()],
            createdAt: serverTimestamp(),
        };
        await setDoc(doc(firestore, 'studentProfiles', user.uid), studentProfile);
    } else if (role === 'company') {
        const companyProfile = {
            id: user.uid,
            email: email,
            companyName: fullName, // Using fullName for companyName on signup.
            industry: '',
            location: '',
            description: '',
            verified: false,
            createdAt: serverTimestamp(),
        };
        await setDoc(doc(firestore, 'companyProfiles', user.uid), companyProfile);
    }
    
    return userCredential;
}

export async function getUserRole(firestore: Firestore, userId: string): Promise<string | null> {
    if (!firestore || !userId) return null;
    const userProfileRef = doc(firestore, 'users', userId);
    const userProfileSnap = await getDoc(userProfileRef);
    if (userProfileSnap.exists()) {
        return userProfileSnap.data().role || null;
    }
    return null;
}

export function signOutUser(auth: Auth) {
    return signOut(auth);
}
