const chai = require('chai');
const groupme = require('groupme').Stateless;
const groupmeConfig = require('../../config/groupme');
const msgHandler = require('../../routes/message/handler');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(sinonChai);

function hello(name, cb) {
  cb('hello ' + name);
}

describe('Sample Unit Tests', function() {
  it('should pass 1 == 1 (canary test)', function() {
    const one = 1;
    one.should.equal(1);
  });

  it('should call callback with correct greeting', function() {
    const cb = sinon.spy();
    hello('foo', cb);
    cb.should.have.been.calledWith('hello foo');
  });

  it('should add a player name to the yes array', () => {
    const game = {
      yes: [],
      maybe: [],
      no: [],
    };

    const updatedGame = msgHandler.addRSVP(game, 'Y', 'Kayla');

    updatedGame.yes.length.should.equal(1);
    updatedGame.yes[0].should.equal('Kayla');
  });

  it('should send game object to groupme', () => {
    const game = {
      time: '2019-06-20T20:00:00+00:00',
      id: '1',
      opponent: 'The Slapnut Magoos',
      location: 'Kimbell Playground (Field A)',
      yes: [],
      no: [],
      maybe: [],
    };

    const groupmeStub = sinon.stub(groupme.Bots, 'post');

    msgHandler.sendGameToGroup(game);

    groupmeStub.should.have.been.calledOnce;
  });

  // handling should be done in three parts
  // 1. request validation (do certain fields exist)?
  // 2. business logic -- do the thing, modify the next game object
  // 3. save the new game object

  // stub db call - return game object that is "most recent"
  // pass object to handling function Y/N/M/JOSHBOT ...
  // assert on object returned by handling function

  // also, rename things to be:
  // message.js
  // handlers/
  //   message.js
});
