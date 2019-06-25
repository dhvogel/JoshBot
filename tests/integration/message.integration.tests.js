// const chai = require('chai');
// const handler = require('../../routes/message/handler');
// const games = require('../../testdata/games');
// const {Datastore} = require('@google-cloud/datastore');
// const datastore = new Datastore();
//
// chai.should();
//
//
// describe('Message Unit Tests', function() {
//   it('should pass 1 == 1 (canary test)', function() {
//     const one = 1;
//     one.should.equal(1);
//   });
//
//   beforeEach(async () => {
//     // Connect to local cloud datastore
//     // Imports the Google Cloud client library
//     const kind = 'Game';
//
//     // The Cloud Datastore key for the new entity
//     const gameKey1 = datastore.key([kind, 1]);
//     const gameKey2 = datastore.key([kind, 2]);
//     const gameKey3 = datastore.key([kind, 3]);
//
//     const entities = [
//       {
//         key: gameKey1,
//         data: games[0],
//       },
//       {
//         key: gameKey2,
//         data: games[1],
//       },
//       {
//         key: gameKey3,
//         data: games[2],
//       },
//     ];
//
//     // Saves the entity
//     const savedEntities = await datastore.upsert(entities);
//     console.log(`Games saved\n ${console.log(JSON.stringify(savedEntities, null, 4))}`);
//   });
//
//   after(async () => {
//     const kind = 'Game';
//     const gameKey1 = datastore.key([kind, 1]);
//     const gameKey2 = datastore.key([kind, 2]);
//     const gameKey3 = datastore.key([kind, 3]);
//     const keys = [gameKey1, gameKey2, gameKey3];
//     const [entities] = await datastore.get(keys);
//     await datastore.delete(entities.map((entity) => entity[datastore.KEY]));
//   });
//
//   beforeEach(function() {
//     // Clear local cloud datastore
//     // Upload a game object happening in the future
//     // Upload a game object heppning in the past
//   });
//
//   it('should add a team member to the yes array of the next game', async () => {
//     // set currentDate
//     // retrive next game object from local cloud datastore
//     // add author to yes array for that game
//     const req = {
//       body: {
//         created_at: 1561271893,
//         name: 'Daniel Vogel',
//         sender_type: 'user',
//         text: 'Y',
//       },
//     };
//
//     // validate state of db
//     const before = await datastore.get(datastore.key(['Game', 2]))
//         .then((result) => result);
//     before[0].attendance.yes.length.should.equal(0);
//
//     handler.msgHandler(req);
//
//     const after = await datastore.get(datastore.key(['Game', 2]))
//         .then((result) => result);
//     after[0].attendance.yes.length.should.equal(1);
//   });
// });
