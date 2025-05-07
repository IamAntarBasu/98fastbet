const express = require('express');
const {
    createSessionResult,
    getAllSessionResults,
    getSessionResultById,
    updateSessionResult,
    deleteSessionResult,
    resetSession
} = require('../controller/sessionResultController');

const router = express.Router();

router.post('/api/session-results/post', createSessionResult);
router.get('/session-results', getAllSessionResults);
router.get('/session-results/:id', getSessionResultById);
router.put('/session-results/:id', updateSessionResult);
router.delete('/session-results/:id', deleteSessionResult);
router.post('/session-results/reset', resetSession);

module.exports = router;
