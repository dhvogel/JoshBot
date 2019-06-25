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

  switch (msg) {
    case 'Y':
    // add player FN to game yes array
    // retrieveAuthor()
      removePlayerFromRSVP(nextGame.attendance, name);
      nextGame.attendance.yes.push(name);
      await datastore.save(nextGame);
      res.sendStatus(204);
    case 'M':
    // add player FN to game maybe array
      removePlayerFromRSVP(nextGame.attendance, name);
      nextGame.attendance.maybe.push(name);
      await datastore.save(nextGame);
      res.sendStatus(204);
    case 'N':
    // add player FN to game no array
      removePlayerFromRSVP(nextGame.attendance, name);
      nextGame.attendance.no.push(name);
      await datastore.save(nextGame);
      res.sendStatus(204);
    case 'JOSHBOT COMPLIMENT':
    // default: give a compliment to the msg author
    // optional: pass a name as a third argument, if passed, give the compliment
    // to the passed name
    case 'JOSHBOT KEEPERS':
    // yields an array of four random players who are RSVP'd yes to the next
    // game
    case 'JOSHBOT LINEUP':
    // yields game object
  }

  return;
};

function removePlayerFromRSVP(att, n) {
  const idx = att.yes.indexOf(n);
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
}
