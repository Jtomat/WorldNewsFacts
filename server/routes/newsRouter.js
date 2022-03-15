const Router = require('express');
const router = new Router();
const newsController = require('../controllers/newsController');

router.post('/parse', newsController.parseNews);
router.post('/generate', newsController.generateNews);
router.get('/getAllNews', newsController.getAll);
router.get('/:id', newsController.findNewsById);
router.delete('/delete', newsController.removeNews);

module.exports = router;