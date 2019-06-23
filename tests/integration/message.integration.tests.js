const chai = require('chai');
const message = require('../../routes/message');
const games = require('../../testdata/games');

chai.should();


describe('Message Unit Tests', function() {
  it('should pass 1 == 1 (canary test)', function() {
    const one = 1;
    one.should.equal(1);
  });

  before(function() {
    // Connect to local cloud datastore
  });

  beforeEach(function() {
    // Clear local cloud datastore
    // Upload a game object happening in the future
    // Upload a game object heppning in the past
  });

  it('should add a team member to the yes array of the next game', () => {
    // retrive next game object from local cloud datastore
    //
  });
});
