const {Datastore} = require('@google-cloud/datastore');
const datastore = new Datastore({projectId: 'joshbot'});
const groupme = require('groupme').Stateless;
const compliments = require('../../config/compliments');
const capitalize = require('capitalize');
const dateFormat = require('dateformat');
const logger = require('../../util/logger').logger;
require('@google-cloud/debug-agent').start();

let BOT_ID_OBJECT;
// 1 out of every 5 times joshbot gains sentience
// const SENTIENCE_GAIN_CHANCE = 0.2;

const msgHandler = async function(req, res, next) {
  if (!req.body.text) return;

  const msg = req.body.text.trim().toUpperCase();

  if (!(msg.startsWith('JOSHBOT') ||
        msg === 'Y' || msg === 'M' || msg === 'N')) {
    logger.info('message not a joshbot command or RSVP. Returning.');
    return;
  }

  const createdUnixTimestamp = req.body.created_at;
  const createdDate = new Date(createdUnixTimestamp*1000);

  const gameQuery = datastore.createQuery('Game')
      .filter('time', '>', createdDate.toISOString())
      .order('time')
      .limit(1);

  let [[nextGame]] = await datastore.runQuery(gameQuery);

  const name = req.body.name;

  if (msg === 'Y' || msg === 'M' || msg === 'N') {
    logger.info(`RSVP received from ${name}`);
    nextGame = removeRSVP(nextGame, name);
    const updatedNextGame = addRSVP(nextGame, msg, name);
    await datastore.save(updatedNextGame);
    return;
  }

  const parsedMsg = msg.split(' ');
  const cmd = `${parsedMsg[0]} ${parsedMsg[1]}`;

  const botIDQuery = datastore.createQuery('BotID');

  [[BOT_ID_OBJECT]] = await datastore.runQuery(botIDQuery);

  switch (cmd) {
    case 'JOSHBOT ADD':
      logger.info('JOSHBOT ADD');
      if (parsedMsg.length < 3) {
        logger.error(`no name to add`);
        postMessageToGroupMe('tell me who to add!');
      } else if (parsedMsg.length > 6) {
        logger.error(`name ${parsedMsg} too long to add`);
      } else {
        logger.info(`adding ${parsedMsg} to game`);
        const nameToAdd = capitalize.words(parsedMsg.slice(2).join(' '));
        const updatedNextGame = addRSVP(nextGame, 'Y', nameToAdd);
        await datastore.save(updatedNextGame);
      }
      break;
    case 'JOSHBOT COMPLIMENT':
      logger.info('JOSHBOT COMPLIMENT');
      // default: give a compliment to the msg author
      // optional: pass a name as a third argument, give the compliment
      // to the passed name.
      // Note: for bottom three, need to programatically post back to groupme
      if (parsedMsg.length === 3) {
        // eslint-disable-next-line
        giveCompliment(`${parsedMsg[2][0]}${parsedMsg[2].slice(1).toLowerCase()}`);
      } else {
        giveCompliment(name);
      }
      break;
    case 'JOSHBOT KEEPERS':
    // yields an array of four random players who are RSVP'd yes to the next
    // game

      break;
    case 'JOSHBOT GAME':
      logger.info('JOSHBOT GAME');
      // yields game object
      sendGameToGroup(nextGame);
      break;
    case 'JOSHBOT HELP':
      logger.info('JOSHBOT HELP');
      const helpMsg = `joshbot add <name>
    adds other player to next game

joshbot compliment <name>
    sends compliment to name

joshbot game
    displays details of next game

joshbot help
    shows joshbot commands

joshbot remove
    removes player from next game

Y/M/N
    RSVP self for next game
`;
      postMessageToGroupMe(helpMsg);
      break;
    case 'JOSHBOT REMOVE':
      logger.info('JOSHBOT REMOVE');
      if (parsedMsg.length < 3) {
        postMessageToGroupMe('tell me who to remove!');
      } else {
        const nameToRemove = capitalize.words(parsedMsg.slice(2).join(' '));
        const updatedNextGame = removeRSVP(nextGame, nameToRemove);
        await datastore.save(updatedNextGame);
      }
      break;
  }

  return;
};

const giveCompliment = (name) => {
  const complimentNum = getRandomInt(0, compliments.length - 1);
  const compliment = compliments[complimentNum];
  const complimentString = `${name}, ${compliment}`;
  postMessageToGroupMe(complimentString);
};

const sendGameToGroup = (game) => {
  if (!game) {
    postMessageToGroupMe('next game not found :(');
    return;
  }
  const time = Date.parse(game.time);
  const formattedTime = dateFormat(time, 'm/d h:MM');
  const gameString = `location: ${game.location}
opponent: ${game.opponent}
time: ${formattedTime}
yes (${game.yes.length}): ${game.yes.join(', ')}
no (${game.no.length}): ${game.no.join(', ')}
maybe (${game.maybe.length}): ${game.maybe.join(', ')}`;
  postMessageToGroupMe(gameString);
};

const postMessageToGroupMe = (msg) => {
  const groupmeCreds = retrieveGroupmeCreds();
  groupme.Bots.post(groupmeCreds.access_token,
      groupmeCreds.bot_id,
      msg, {picture_url: null}, () => {});
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
  const botId = BOT_ID_OBJECT.bot_id;
  return {
    access_token: accessToken,
    bot_id: botId,
  };
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

module.exports = {
  addRSVP: addRSVP,
  msgHandler: msgHandler,
  sendGameToGroup: sendGameToGroup,
};
