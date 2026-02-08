// Storage Service - User-specific localStorage management

/**
 * Get current user UID from localStorage
 */
const getCurrentUserUid = (): string | null => {
    const profile = localStorage.getItem('km_user_profile');
    if (profile) {
        try {
            const user = JSON.parse(profile);
            return user.uid || null;
        } catch {
            return null;
        }
    }
    return null;
};

/**
 * Get a user-specific storage key
 */
export const getUserKey = (baseKey: string): string => {
    const uid = getCurrentUserUid();
    if (uid) {
        return `${baseKey}_${uid}`;
    }
    return baseKey;
};

/**
 * Get item from user-specific localStorage
 */
export const getUserItem = (baseKey: string): string | null => {
    return localStorage.getItem(getUserKey(baseKey));
};

/**
 * Set item in user-specific localStorage
 */
export const setUserItem = (baseKey: string, value: string): void => {
    localStorage.setItem(getUserKey(baseKey), value);
};

/**
 * Remove item from user-specific localStorage
 */
export const removeUserItem = (baseKey: string): void => {
    localStorage.removeItem(getUserKey(baseKey));
};

/**
 * Clear all user-specific data for a specific user
 */
export const clearUserData = (uid?: string): void => {
    const targetUid = uid || getCurrentUserUid();
    if (!targetUid) return;

    const suffix = `_${targetUid}`;
    const keysToRemove: string[] = [];

    // Find all keys that belong to this user
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.endsWith(suffix)) {
            keysToRemove.push(key);
        }
    }

    // Remove user-specific keys
    keysToRemove.forEach(key => localStorage.removeItem(key));
};

/**
 * Clear all app data (for logout)
 * Removes both user-specific data and shared data
 */
export const clearAllAppData = (): void => {
    const uid = getCurrentUserUid();

    // Clear user-specific data
    if (uid) {
        clearUserData(uid);
    }

    // Shared keys that should be reset on logout
    const sharedKeysToRemove = [
        'kisaanmitra_farm_plots',
        'km_farm_irrigation',
        'km_farm_enrichment',
        'km_farm_pest',
        'km_diag_history',
        'km_community_groups',
        'km_user_profile',
        'km_auth',
        'km_access_token',
        'km_refresh_token',
        'kisaanmitra_daily_challenges',
        'kisaanmitra_challenges_date'
    ];

    sharedKeysToRemove.forEach(key => localStorage.removeItem(key));

    // Fallback: Clear any other user-specific data that might have been missed
    // ONLY if we didn't have a UID (to handle cases where profile was already cleared)
    if (!uid) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('_u-') || key.includes('_uid-'))) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
};

/**
 * Migrate old shared keys to user-specific keys
 * Call this on login to move any existing shared data to user-specific storage
 */
export const migrateToUserStorage = (): void => {
    const uid = getCurrentUserUid();
    if (!uid) return;

    const keysToMigrate = [
        'kisaanmitra_farm_plots',
        'km_farm_irrigation',
        'km_farm_enrichment',
        'km_farm_pest',
        'km_diag_history',
        'km_community_groups'
    ];

    keysToMigrate.forEach(oldKey => {
        const value = localStorage.getItem(oldKey);
        if (value) {
            const newKey = `${oldKey}_${uid}`;
            // Only migrate if user-specific key doesn't exist
            if (!localStorage.getItem(newKey)) {
                localStorage.setItem(newKey, value);
            }
            // Don't remove old key here - it will be removed on next logout
        }
    });
};

export default {
    getUserKey,
    getUserItem,
    setUserItem,
    removeUserItem,
    clearUserData,
    clearAllAppData,
    migrateToUserStorage
};
