const express = require('express');
// eslint-disable-next-line
const router = express.Router();
const handler = require('./message/handler');

router.post('/', handler.msgHandler);

module.exports = router;
