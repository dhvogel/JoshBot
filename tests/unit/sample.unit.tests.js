const chai = require('chai');
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
      attendance: {
        yes: [],
        maybe: [],
        no: [],
      },
    };

    const updatedGame = msgHandler.handleRSVP(game, 'Y', 'Dan');

    updatedGame.attendance.yes.length.should.equal(1);
    updatedGame.attendance.yes[0].should.equal('Dan');
  });

  it('remove a player from the maybe array and add to the yes array', () => {
    const game = {
      attendance: {
        yes: [],
        maybe: [],
        no: ['Kayla'],
      },
    };

    const updatedGame = msgHandler.handleRSVP(game, 'M', 'Kayla');

    updatedGame.attendance.maybe.length.should.equal(1);
    updatedGame.attendance.no.length.should.equal(0);
    updatedGame.attendance.maybe[0].should.equal('Kayla');
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
