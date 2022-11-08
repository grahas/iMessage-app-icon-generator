var express = require('express');
var router = express.Router();

/* POST upload png file. */
router.post('/', function(req, res, next) {
    res.sendStatus(200);
    console.log(req.files.icon);
});

module.exports = router;
