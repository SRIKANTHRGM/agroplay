const { activityDb, journeyDb, userDb } = require('../config/database');

/**
 * Save or update an activity
 */
const saveActivity = async (req, res) => {
    try {
        const { uid } = req.user;
        const { activityType, activityKey, data } = req.body;

        if (!activityType || !activityKey) {
            return res.status(400).json({
                success: false,
                message: 'activityType and activityKey are required.'
            });
        }

        activityDb.save(uid, activityType, activityKey, data || {});

        res.json({
            success: true,
            message: 'Activity saved successfully.'
        });
    } catch (error) {
        console.error('Save activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error saving activity.'
        });
    }
};

/**
 * Get a specific activity
 */
const getActivity = async (req, res) => {
    try {
        const { uid } = req.user;
        const { activityType, activityKey } = req.params;

        const activity = activityDb.get(uid, activityType, activityKey);

        res.json({
            success: true,
            activity: activity ? activity.activity_data : null,
            exists: !!activity
        });
    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving activity.'
        });
    }
};

/**
 * Get all activities of a type
 */
const getActivitiesByType = async (req, res) => {
    try {
        const { uid } = req.user;
        const { activityType } = req.params;

        const activities = activityDb.getByType(uid, activityType);

        res.json({
            success: true,
            activities: activities.map(a => ({
                key: a.activity_key,
                data: a.activity_data,
                updatedAt: a.updated_at
            }))
        });
    } catch (error) {
        console.error('Get activities by type error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving activities.'
        });
    }
};

/**
 * Get all activities for a user (for syncing on login)
 */
const getAllActivities = async (req, res) => {
    try {
        const { uid } = req.user;

        const activities = activityDb.getAllForUser(uid);
        const journeys = journeyDb.getAllForUser(uid);

        // Group activities by type
        const grouped = {};
        activities.forEach(a => {
            if (!grouped[a.activity_type]) {
                grouped[a.activity_type] = {};
            }
            grouped[a.activity_type][a.activity_key] = a.activity_data;
        });

        res.json({
            success: true,
            activities: grouped,
            journeys: journeys,
            totalActivities: activities.length,
            totalJourneys: journeys.length
        });
    } catch (error) {
        console.error('Get all activities error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving activities.'
        });
    }
};

/**
 * Delete an activity
 */
const deleteActivity = async (req, res) => {
    try {
        const { uid } = req.user;
        const { activityType, activityKey } = req.params;

        activityDb.delete(uid, activityType, activityKey);

        res.json({
            success: true,
            message: 'Activity deleted successfully.'
        });
    } catch (error) {
        console.error('Delete activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting activity.'
        });
    }
};

/**
 * Create a new journey
 */
const createJourney = async (req, res) => {
    try {
        const { uid } = req.user;
        const journeyData = req.body;

        if (!journeyData.id || !journeyData.cropId || !journeyData.cropName) {
            return res.status(400).json({
                success: false,
                message: 'id, cropId, and cropName are required.'
            });
        }

        journeyDb.create(uid, journeyData);

        res.status(201).json({
            success: true,
            message: 'Journey created successfully.',
            journey: journeyDb.getById(journeyData.id)
        });
    } catch (error) {
        console.error('Create journey error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating journey.'
        });
    }
};

/**
 * Get all journeys for user
 */
const getJourneys = async (req, res) => {
    try {
        const { uid } = req.user;
        const journeys = journeyDb.getAllForUser(uid);

        res.json({
            success: true,
            journeys
        });
    } catch (error) {
        console.error('Get journeys error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error retrieving journeys.'
        });
    }
};

/**
 * Update a journey
 */
const updateJourney = async (req, res) => {
    try {
        const { journeyId } = req.params;
        const updates = req.body;

        const journey = journeyDb.update(journeyId, updates);

        if (!journey) {
            return res.status(404).json({
                success: false,
                message: 'Journey not found.'
            });
        }

        res.json({
            success: true,
            message: 'Journey updated successfully.',
            journey
        });
    } catch (error) {
        console.error('Update journey error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating journey.'
        });
    }
};

/**
 * Delete a journey
 */
const deleteJourney = async (req, res) => {
    try {
        const { journeyId } = req.params;

        journeyDb.delete(journeyId);

        res.json({
            success: true,
            message: 'Journey deleted successfully.'
        });
    } catch (error) {
        console.error('Delete journey error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting journey.'
        });
    }
};

/**
 * Bulk sync activities (for efficient syncing on login)
 */
const syncActivities = async (req, res) => {
    try {
        const { uid } = req.user;
        const { activities, journeys } = req.body;

        let savedActivities = 0;
        let savedJourneys = 0;

        // Sync activities
        if (activities && typeof activities === 'object') {
            Object.entries(activities).forEach(([activityType, items]) => {
                if (typeof items === 'object') {
                    Object.entries(items).forEach(([activityKey, data]) => {
                        activityDb.save(uid, activityType, activityKey, data);
                        savedActivities++;
                    });
                }
            });
        }

        // Sync journeys
        if (Array.isArray(journeys)) {
            journeys.forEach(journey => {
                const existing = journeyDb.getById(journey.id);
                if (existing) {
                    journeyDb.update(journey.id, journey);
                } else {
                    journeyDb.create(uid, journey);
                }
                savedJourneys++;
            });
        }

        res.json({
            success: true,
            message: 'Sync completed successfully.',
            savedActivities,
            savedJourneys
        });
    } catch (error) {
        console.error('Sync activities error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error syncing activities.'
        });
    }
};

module.exports = {
    saveActivity,
    getActivity,
    getActivitiesByType,
    getAllActivities,
    deleteActivity,
    createJourney,
    getJourneys,
    updateJourney,
    deleteJourney,
    syncActivities
};
