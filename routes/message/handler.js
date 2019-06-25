const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore();
const groupme = require('groupme').Stateless;
const groupmeConfig = require('../../config/groupme');

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
    nextGame.attendance = removePlayerFromRSVP(nextGame.attendance, name);
    const updatedNextGame = addRSVP(nextGame, msg, name);
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
    case 'JOSHBOT GAME':
    // yields game object
      sendGameToGroup(nextGame);
  }

  return;
};

const sendGameToGroup = (game) => {
  const groupmeCreds = retrieveGroupmeCreds();
  groupme.Bots.post(groupmeCreds.access_token,
      groupmeCreds.bot_id,
      JSON.stringify(game, null, 4), {picture_url: null}, () => {});
};

const handleRSVP = (game, msg, name) => {
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

const addRSVP = (att, n) => {
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

const retrieveGroupmeCreds = () => {
  const accessToken = groupmeConfig.access_token;
  const botId = groupmeConfig.bot_id;
  return {
    access_token: accessToken,
    bot_id: botId,
  };
};

module.exports = {
  handleRSVP: handleRSVP,
  sendGameToGroup: sendGameToGroup,
};
