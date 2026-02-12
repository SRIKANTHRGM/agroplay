
import CryptoJS from 'crypto-js';

// Use a consistent key for the application
// In a real production app, this should be an environment variable
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'kisaan-mitra-secure-storage-key-2024';

/**
 * Encrypt data before storing
 */
export const encryptData = (data: any): string => {
    try {
        const stringData = JSON.stringify(data);
        return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
    } catch (error) {
        console.error('Encryption failed:', error);
        return '';
    }
};

/**
 * Decrypt data after retrieving
 */
export const decryptData = (ciphertext: string): any => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        if (!decryptedData) return null;
        return JSON.parse(decryptedData);
    } catch (error) {
        // If decryption fails, it might be legacy plaintext data
        // specific fallback or return null
        // console.error('Decryption failed:', error); 
        return null;
    }
};

export default {
    encryptData,
    decryptData
};
