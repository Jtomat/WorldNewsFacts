const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const newsRouter = require('./newsRouter');
const voteRouter = require('./voteRouter');

router.use('/user', userRouter);
router.use('/news', newsRouter);
router.use('/vote', voteRouter);

module.exports = router;