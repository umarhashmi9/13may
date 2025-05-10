
// This file is kept for reference but no longer used.
// The application now uses Firebase for backend services.

// Import the firebase configuration if needed
import { auth, database } from '../firebase/config';

export const getAuth = () => auth;
export const getDatabase = () => database;
