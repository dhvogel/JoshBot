const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore({projectId: 'joshbot'});
const groupme = require('groupme').Stateless;
const groupmeConfig = require('../../config/groupme');

const msgHandler = async function(req, res, next) {
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

  let [[nextGame]] = await datastore.runQuery(query);

  const name = req.body.name;

  if (!createdUnixTimestamp || !name) {
    console.log('either createdUnixTimestamp or name not present');
    return;
  }

  if (msg === 'Y' || msg === 'M' || msg === 'N') {
    nextGame = removeRSVP(nextGame, name);
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

const addRSVP = (game, msg, name) => {
  switch (msg) {
    case 'Y':
      game.yes.push(name);
      break;
    case 'M':
      game.maybe.push(name);
      break;
    case 'N':
      game.no.push(name);
      break;
  }
  return game;
};

const removeRSVP = (att, n) => {
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
  const accessToken = process.env.GROUPME_ACCESS_TOKEN;
  const botId = groupmeConfig.bot_id;
  return {
    access_token: accessToken,
    bot_id: botId,
  };
};

module.exports = {
  addRSVP: addRSVP,
  msgHandler: msgHandler,
  sendGameToGroup: sendGameToGroup,
};
