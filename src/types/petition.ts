// src/types/petition.ts

// Basic petition type
export interface Petition {
    id: string;
    petitionerId: string;
    title: string;
    content: string;
    status: PetitionStatus;
    signatures: number;
    response: string | null;
    createdAt: string;
  }
  
  // Petition statuses
  export type PetitionStatus = 'open' | 'closed';
  
  // Extended petition type including petitioner information
  export interface PetitionWithPetitioner extends Petition {
    petitioner: {
      fullName: string;
      email: string;
    };
  }
  
  // Input type for creating a new petition
  export interface CreatePetitionInput {
    title: string;
    content: string;
  }
  
  // Signature related types
  export interface Signature {
    userId: string;
    petitionId: string;
    signedAt: string;
  }
  
  // Admin settings types
  export interface PetitionSettings {
    signatureThreshold: number;
    updatedAt: string;
  }
  
  // Response from petition API
  export interface PetitionResponse {
    petitions: PetitionWithPetitioner[];
    total?: number;
    page?: number;
    limit?: number;
  }
  
  // API response for single petition
  export interface SinglePetitionResponse {
    petition: PetitionWithPetitioner;
    hasUserSigned?: boolean;
    thresholdMet?: boolean;
  }
  
  // Error response type
  export interface PetitionError {
    code: string;
    message: string;
  }
  
  // Query parameters for fetching petitions
  export interface PetitionQueryParams {
    status?: PetitionStatus;
    page?: number;
    limit?: number;
    sortBy?: 'createdAt' | 'signatures';
    sortOrder?: 'asc' | 'desc';
  }
  
  // Admin update petition input
  export interface UpdatePetitionInput {
    response: string;
    status?: PetitionStatus;
  }