const Router = require('express');
const router = new Router();
const newsController = require('../controllers/newsController');

router.get('/parse', newsController.parseNews);
router.get('/generate', newsController.generateNews);
router.get('/getAllNews', newsController.getAll);
router.get('/:id', newsController.findNewsById);
router.delete('/delete', newsController.removeNews);

module.exports = router;