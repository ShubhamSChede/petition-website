// src/lib/firebase/db.ts

import { 
    collection, 
    doc, 
    getDocs, 
    getDoc, 
    setDoc, 
    updateDoc, 
    query, 
    where, 
    orderBy,
    increment,
    type DocumentData,
    type QueryDocumentSnapshot, 
    writeBatch
  } from 'firebase/firestore';
  import { db } from './config';
  import type { 
    Petition, 
    PetitionWithPetitioner, 
    CreatePetitionInput 
  } from '@/types/petition';
  
  // Format Firestore data
  const formatPetitionData = (
    doc: QueryDocumentSnapshot<DocumentData>
  ): Petition => {
    const data = doc.data();
    return {
      id: doc.id,
      petitionerId: data.petitionerId,
      title: data.title,
      content: data.content,
      status: data.status,
      signatures: data.signatures,
      response: data.response,
      createdAt: data.createdAt
    };
  };
  
  // Get all petitions
  export async function getAllPetitions(): Promise<PetitionWithPetitioner[]> {
    try {
      const petitionsQuery = query(
        collection(db, 'petitions'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(petitionsQuery);
      
      // Get all petitions
      const petitions = querySnapshot.docs.map(formatPetitionData);
      
      // Get petitioner details for each petition
      const petitionsWithPetitioners = await Promise.all(
        petitions.map(async (petition) => {
          const petitionerDoc = await getDoc(doc(db, 'users', petition.petitionerId));
          const petitionerData = petitionerDoc.data();
          
          return {
            ...petition,
            petitioner: {
              fullName: petitionerData?.fullName || 'Unknown',
              email: petitionerData?.email || 'Unknown'
            }
          };
        })
      );
  
      return petitionsWithPetitioners;
    } catch (error) {
      console.error('Error getting petitions:', error);
      throw error;
    }
  }
  
  // Get open petitions
  export async function getOpenPetitions(): Promise<PetitionWithPetitioner[]> {
    try {
      const petitionsQuery = query(
        collection(db, 'petitions'),
        where('status', '==', 'open'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(petitionsQuery);
      const petitions = querySnapshot.docs.map(formatPetitionData);
      
      const petitionsWithPetitioners = await Promise.all(
        petitions.map(async (petition) => {
          const petitionerDoc = await getDoc(doc(db, 'users', petition.petitionerId));
          const petitionerData = petitionerDoc.data();
          
          return {
            ...petition,
            petitioner: {
              fullName: petitionerData?.fullName || 'Unknown',
              email: petitionerData?.email || 'Unknown'
            }
          };
        })
      );
  
      return petitionsWithPetitioners;
    } catch (error) {
      console.error('Error getting open petitions:', error);
      throw error;
    }
  }
  
  // Get single petition
  export async function getPetition(id: string): Promise<PetitionWithPetitioner | null> {
    try {
      const petitionDoc = await getDoc(doc(db, 'petitions', id));
      
      if (!petitionDoc.exists()) {
        return null;
      }
  
      const petition = formatPetitionData(petitionDoc as any);
      const petitionerDoc = await getDoc(doc(db, 'users', petition.petitionerId));
      const petitionerData = petitionerDoc.data();
  
      return {
        ...petition,
        petitioner: {
          fullName: petitionerData?.fullName || 'Unknown',
          email: petitionerData?.email || 'Unknown'
        }
      };
    } catch (error) {
      console.error('Error getting petition:', error);
      throw error;
    }
  }
  
  // Create petition
  export async function createPetition(
    userId: string, 
    input: CreatePetitionInput
  ): Promise<string> {
    try {
      const petitionRef = doc(collection(db, 'petitions'));
      await setDoc(petitionRef, {
        petitionerId: userId,
        title: input.title,
        content: input.content,
        status: 'open',
        signatures: 0,
        response: null,
        createdAt: new Date().toISOString()
      });
  
      return petitionRef.id;
    } catch (error) {
      console.error('Error creating petition:', error);
      throw error;
    }
  }
  
  // Sign petition
  export async function signPetition(userId: string, petitionId: string): Promise<void> {
    try {
      // Start a batch write
      const batch = writeBatch(db);
  
      // Check for existing signature
      const signatureQuery = query(
        collection(db, 'signatures'),
        where('userId', '==', userId),
        where('petitionId', '==', petitionId)
      );
      
      const signatureSnapshot = await getDocs(signatureQuery);
      
      if (!signatureSnapshot.empty) {
        throw new Error('You have already signed this petition');
      }
  
      // Get petition data to check if it's the petitioner's own petition
      const petitionDoc = await getDoc(doc(db, 'petitions', petitionId));
      if (petitionDoc.data()?.petitionerId === userId) {
        throw new Error('You cannot sign your own petition');
      }
  
      // Create signature
      const signatureRef = doc(collection(db, 'signatures'));
      batch.set(signatureRef, {
        userId,
        petitionId,
        signedAt: new Date().toISOString()
      });
  
      // Update petition signature count
      const petitionRef = doc(db, 'petitions', petitionId);
      batch.update(petitionRef, {
        signatures: increment(1)
      });
  
      // Commit both operations
      await batch.commit();
    } catch (error) {
      console.error('Error signing petition:', error);
      throw error;
    }
  }
  
  // Admin: Update petition response
  export async function updatePetitionResponse(
    petitionId: string, 
    response: string
  ): Promise<void> {
    try {
      const petitionRef = doc(db, 'petitions', petitionId);
      await updateDoc(petitionRef, {
        response,
        status: 'closed'
      });
    } catch (error) {
      console.error('Error updating petition response:', error);
      throw error;
    }
  }
  
  // Admin: Get signature threshold
  export async function getSignatureThreshold(): Promise<number> {
    try {
      const thresholdDoc = await getDoc(doc(db, 'settings', 'thresholds'));
      return thresholdDoc.data()?.signatureThreshold || 100; // Default threshold
    } catch (error) {
      console.error('Error getting signature threshold:', error);
      throw error;
    }
  }
  
  // Admin: Update signature threshold
  export async function updateSignatureThreshold(threshold: number): Promise<void> {
    try {
      await setDoc(doc(db, 'settings', 'thresholds'), {
        signatureThreshold: threshold,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating signature threshold:', error);
      throw error;
    }
  }
  
  // Check if user has signed petition
  export async function hasUserSignedPetition(
    userId: string, 
    petitionId: string
  ): Promise<boolean> {
    try {
      const signatureQuery = query(
        collection(db, 'signatures'),
        where('userId', '==', userId),
        where('petitionId', '==', petitionId)
      );
      
      const signatureSnapshot = await getDocs(signatureQuery);
      return !signatureSnapshot.empty;
    } catch (error) {
      console.error('Error checking signature:', error);
      throw error;
    }
  }