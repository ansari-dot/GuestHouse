import express from 'express';
import { addFeedback } from '../controllers/feedback.js';
import { getFeedback } from '../controllers/feedback.js';
import { deleteFeedback } from '../controllers/feedback.js';
const router = express.Router();



// route to post the or add the feedback
router.post('/addFeedback', addFeedback);
// route to get the feedback;

router.post('/getFeedback', getFeedback);


// route to delete the feedback

router.delete('/deleteFeedback', deleteFeedback);
export default router;