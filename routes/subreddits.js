const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const subredditController = require('../controllers/subredditController');

router.post('/new-subreddit', subredditController.createSubreddit);
router.get('/', subredditController.getAllSubreddits);
router.get('/subreddit/:subreddit', subredditController.getSubreddit);

module.exports = router;
