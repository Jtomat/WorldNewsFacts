const Router = require('express');
const router = new Router();
const voteController = require('../controllers/voteController');

router.get('/votesForUser', voteController.votesForUser);
router.get('/votesForNews', voteController.votesForNews);
router.get('/:id', voteController.voteById);
router.post('/newVote', voteController.newVote);
router.delete('/deleteVote', voteController.deleteVote);

module.exports = router;