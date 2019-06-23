const express = require('express');
// eslint-disable-next-line
const router = express.Router();

router.post('/', function(req, res, next) {
  console.log(req.body);
  if (req.body.text === 'attendance report') {
    console.log('attendance report requested');
  }
});

module.exports = router;
