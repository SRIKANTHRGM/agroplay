
/**
 * Encrypt data before storing (Base64 + URI encode fallback)
 */
export const encryptData = (data: any): string => {
    try {
        const stringData = JSON.stringify(data);
        return btoa(encodeURIComponent(stringData));
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
        if (!ciphertext) return null;
        const decoded = decodeURIComponent(atob(ciphertext));
        return JSON.parse(decoded);
    } catch (error) {
        try {
            return JSON.parse(ciphertext);
        } catch {
            return null;
        }
    }
};

export default {
    encryptData,
    decryptData
};
