
// Mock Firebase Service to support offline usage and resolve API Key errors
// in environments without specific Firebase credentials.

// Session-aware mock storage for "synced" feel
const mockStorage: Record<string, any> = {};

export const auth: any = {
  currentUser: null,
};

export const db: any = {};

export const googleProvider: any = {};

// Mock Auth Functions
export const signInWithPopup = async (authInstance: any, provider: any) => {
  await new Promise(r => setTimeout(r, 1200));
  return {
    user: {
      uid: 'uid-test-farmer',
      displayName: 'Modern Farmer',
      email: 'farmer@agroplay.nexus',
      photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=AgroPlay`,
      emailVerified: true
    }
  };
};

// Mock Firestore Functions - Supports multi-segment paths
export const doc = (dbInstance: any, ...pathSegments: string[]) => {
  const path = pathSegments.filter(Boolean).join('/');
  return {
    id: pathSegments[pathSegments.length - 1],
    path: path,
  };
};

export const setDoc = async (docRef: any, data: any) => {
  console.log(`[Firebase Mock] Writing to: ${docRef.path}`, data);
  mockStorage[docRef.path] = { 
    ...data, 
    _lastSynced: new Date().toISOString() 
  };
  return Promise.resolve();
};

export const getDoc = async (docRef: any) => {
  const data = mockStorage[docRef.path];
  return {
    exists: () => !!data,
    data: () => data || null
  };
};

export const serverTimestamp = () => new Date().toISOString();

// Mock initialization
export const initializeApp = () => ({});
export const getAuth = () => auth;
export const getFirestore = () => db;
export const GoogleAuthProvider = function() { return googleProvider; };
