import { chai } from 'meteor/practicalmeteor:chai';
import chaiAsPromised from 'chai-as-promised';
import Promise    from 'bluebird';
import web3       from '/imports/lib/thirdparty/web3.js';
import ipfsJs     from 'ipfs-js';
import Users      from './Users.js';

chai.use(chaiAsPromised);
const expect = chai.expect;

ipfs          = Promise.promisifyAll(ipfsJs);

const userData = {
  name: "jack",
  email: "jack@mail.com",
  address: {
    line1: "82 Vicars Hill",
    line2: " ",
    city: "London",
    postcode: "SE13 7JL",
    country: "GB"
  }
}

var userAddr = ''

describe('Users', function() {

  before(function() {
    ipfs.setProvider({host: 'localhost', port: '5001'});
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    userAddr = web3.eth.accounts[4];
  });

  var users = {};

  beforeEach(function() {
    users = new Users(ipfs, web3);
  });

  it('should be exported as defined object', function() {
    expect(users).to.be.ok;
  });

  
  it('should set schema for user collection', function() {
    var fakeSchema = {name: "fake schema"};
    users.setSchema(fakeSchema);
    expect(users.getSchema()).to.equal(fakeSchema);
  });
  
  describe('checkUserData', function() {

    /*
    it('should throw error if no schema exists', function() {
      var userData = {
        name: "jack"
      }
      users.setSchema();
      // expect requires a function as parameter!
      expect(users.checkData.bind(users, userData)).to.throw(Error);
    });
    */

    it('should throw an error if data does not match schema', function() {
      var userData = {
        name: 10
      }
      expect(users.checkData.bind(users, userData)).to.throw(Error);
    });

    it('should accept well defined data', function() {
      expect(users.checkData.bind(userData)).to.throw(Error);
    });

  });

  describe('addToIPFS', function() {
    it('should add user data to ipfs', function() {
      users.addToIPFS(userData).then(function(hash) {
        ipfs.catJson(hash, function(err, res) {
          if (err) { throw err };
          expect(userData).to.eql(res);
        })
      })
    });
  });

  describe('set', function() {
    it('should print txReceipt', function() {
      users.set(userAddr, userData).then(function(receipt){
        console.log(receipt);
      });
    });
  });

  // How to stub!? !? 
  describe('get', function() {
    it('should return empty object if no user registered', function() {
      users.get(userAddr).then(function(userData) {
        console.log(userData);
      });
    });
  });
  
});
