const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();

module.exports.msgHandler = async function(req, res, next) {
  if (!req.body.text) return;

  const msg = req.body.text.trim().toUpperCase();

  if (!(msg.startsWith('JOSHBOT') ||
        msg === 'Y' || msg === 'M' || msg === 'N')) {
    return;
  }

  const createdUnixTimestamp = req.body.created_at;
  const createdDate = new Date(createdUnixTimestamp*1000);

  const query = datastore.createQuery('Game')
      .filter('time', '>', createdDate.toISOString())
      .order('time')
      .limit(1);

  const [[nextGame]] = await datastore.runQuery(query);

  const name = req.body.name;

  if (!createdUnixTimestamp || !name) {
    console.log('either createdUnixTimestamp or name not present');
    return;
  }

  if (msg === 'Y' || msg === 'M' || msg === 'N') {
    const updatedNextGame = handleRSVP(nextGame, msg, name);
    await datastore.save(updatedNextGame);
    res.sendStatus(204);
    return;
  }

  switch (msg) {
    case 'JOSHBOT COMPLIMENT':
    // default: give a compliment to the msg author
    // optional: pass a name as a third argument, if passed, give the compliment
    // to the passed name.
    // Note: for the bottom three, need to programatically post back to groupme
    case 'JOSHBOT KEEPERS':
    // yields an array of four random players who are RSVP'd yes to the next
    // game
    case 'JOSHBOT LINEUP':
    // yields game object
    sendGameToGroup(nextGame);
  }

  return;
};

const sendGameToGroup = (game) => {
  
}

const handleRSVP = (game, msg, name) => {
  game.attendance = removePlayerFromRSVP(game.attendance, name);
  switch (msg) {
    case 'Y':
      game.attendance.yes.push(name);
      break;
    case 'M':
      game.attendance.maybe.push(name);
      break;
    case 'N':
      game.attendance.no.push(name);
      break;
  }
  return game;
};

const removePlayerFromRSVP = (att, n) => {
  let idx;
  idx = att.yes.indexOf(n);
  if (idx > -1) {
    att.yes.splice(idx, 1);
  }

  idx = att.maybe.indexOf(n);
  if (idx > -1) {
    att.maybe.splice(idx, 1);
  }

  idx = att.no.indexOf(n);
  if (idx > -1) {
    att.no.splice(idx, 1);
  }

  return att;
};

module.exports = {
  handleRSVP: handleRSVP,
};
