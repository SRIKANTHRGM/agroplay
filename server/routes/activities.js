const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { verifyToken } = require('../middleware/auth');

// All routes require authentication
router.use(verifyToken);

// Activity routes
router.post('/save', activityController.saveActivity);
router.get('/all', activityController.getAllActivities);
router.get('/type/:activityType', activityController.getActivitiesByType);
router.get('/:activityType/:activityKey', activityController.getActivity);
router.delete('/:activityType/:activityKey', activityController.deleteActivity);

// Journey routes
router.post('/journeys', activityController.createJourney);
router.get('/journeys', activityController.getJourneys);
router.put('/journeys/:journeyId', activityController.updateJourney);
router.delete('/journeys/:journeyId', activityController.deleteJourney);

// Bulk sync endpoint
router.post('/sync', activityController.syncActivities);

module.exports = router;
