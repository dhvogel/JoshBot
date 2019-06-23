const express = require('express');
// eslint-disable-next-line
const router = express.Router();

router.post('/', function(req, res, next) {
  if (!req.body.text) return;

  const msg = req.body.text.trim().toUpperCase();

  if (!(msg.startsWith('JOSHBOT') ||
        msg === 'Y' || msg === 'M' || msg === 'N')) {
    return;
  }

  switch (msg) {
    case 'Y':
    // add player FN to game yes array
    // retrieveAuthor()
    case 'M':
    // add player FN to game maybe array
    case 'N':
    // add player FN to game no array
    case 'JOSHBOT COMPLIMENT':
    // default: give a compliment to the msg author
    // optional: pass a name as a third argument, if passed, give the compliment
    // to the passed name
    case 'JOSHBOT KEEPERS':
    // yields an array of four random players who are RSVP'd yes to the next
    // game
    case 'JOSHBOT LINEUP':
    // return game object
  }
});

module.exports = router;
