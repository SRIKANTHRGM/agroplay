// Activity Service - Syncs user activities with backend

import { getAccessToken } from './authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_URL = `${API_BASE}/api/activities`;

/**
 * Get authorization headers
 */
const getHeaders = (): HeadersInit => {
    const token = getAccessToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

/**
 * Save an activity to the backend
 */
export const saveActivity = async (
    activityType: string,
    activityKey: string,
    data: Record<string, any>
): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/save`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ activityType, activityKey, data })
        });
        return response.ok;
    } catch (error) {
        console.error('Error saving activity:', error);
        return false;
    }
};

/**
 * Get a specific activity
 */
export const getActivity = async (
    activityType: string,
    activityKey: string
): Promise<Record<string, any> | null> => {
    try {
        const response = await fetch(`${API_URL}/${activityType}/${activityKey}`, {
            headers: getHeaders()
        });
        const data = await response.json();
        return data.success ? data.activity : null;
    } catch (error) {
        console.error('Error getting activity:', error);
        return null;
    }
};

/**
 * Get all activities of a type
 */
export const getActivitiesByType = async (
    activityType: string
): Promise<Array<{ key: string; data: Record<string, any>; updatedAt: string }>> => {
    try {
        const response = await fetch(`${API_URL}/type/${activityType}`, {
            headers: getHeaders()
        });
        const data = await response.json();
        return data.success ? data.activities : [];
    } catch (error) {
        console.error('Error getting activities by type:', error);
        return [];
    }
};

/**
 * Get all user activities (for syncing on login)
 */
export const getAllActivities = async (): Promise<{
    activities: Record<string, Record<string, any>>;
    journeys: any[];
} | null> => {
    try {
        const response = await fetch(`${API_URL}/all`, {
            headers: getHeaders()
        });
        const data = await response.json();
        return data.success ? { activities: data.activities, journeys: data.journeys } : null;
    } catch (error) {
        console.error('Error getting all activities:', error);
        return null;
    }
};

/**
 * Delete an activity
 */
export const deleteActivity = async (
    activityType: string,
    activityKey: string
): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/${activityType}/${activityKey}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting activity:', error);
        return false;
    }
};

// Journey-specific functions

/**
 * Create a new cultivation journey
 */
export const createJourney = async (journey: {
    id: string;
    cropId: string;
    cropName: string;
    startDate?: string;
    steps?: any[];
}): Promise<any | null> => {
    try {
        const response = await fetch(`${API_URL}/journeys`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(journey)
        });
        const data = await response.json();
        return data.success ? data.journey : null;
    } catch (error) {
        console.error('Error creating journey:', error);
        return null;
    }
};

/**
 * Get all user journeys
 */
export const getJourneys = async (): Promise<any[]> => {
    try {
        const response = await fetch(`${API_URL}/journeys`, {
            headers: getHeaders()
        });
        const data = await response.json();
        return data.success ? data.journeys : [];
    } catch (error) {
        console.error('Error getting journeys:', error);
        return [];
    }
};

/**
 * Update a journey
 */
export const updateJourney = async (
    journeyId: string,
    updates: Record<string, any>
): Promise<any | null> => {
    try {
        const response = await fetch(`${API_URL}/journeys/${journeyId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(updates)
        });
        const data = await response.json();
        return data.success ? data.journey : null;
    } catch (error) {
        console.error('Error updating journey:', error);
        return null;
    }
};

/**
 * Delete a journey
 */
export const deleteJourney = async (journeyId: string): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/journeys/${journeyId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting journey:', error);
        return false;
    }
};

/**
 * Bulk sync all local activities to backend
 */
export const syncActivities = async (
    activities: Record<string, Record<string, any>>,
    journeys: any[]
): Promise<boolean> => {
    try {
        const response = await fetch(`${API_URL}/sync`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ activities, journeys })
        });
        return response.ok;
    } catch (error) {
        console.error('Error syncing activities:', error);
        return false;
    }
};

// Activity type constants for consistency
export const ACTIVITY_TYPES = {
    GAME_SCORE: 'game_score',
    LESSON_PROGRESS: 'lesson_progress',
    DIAGNOSIS_HISTORY: 'diagnosis_history',
    MARKETPLACE_CART: 'marketplace_cart',
    FORUM_POSTS: 'forum_posts',
    GROUP_MEMBERSHIP: 'group_membership',
    PLANNER_DATA: 'planner_data',
    VIRTUAL_FARM: 'virtual_farm',
    CONVERTER_PROGRESS: 'converter_progress',
    SUBSIDY_APPLICATIONS: 'subsidy_applications',
    INSURANCE_CLAIMS: 'insurance_claims',
    PREFERENCES: 'preferences'
} as const;
