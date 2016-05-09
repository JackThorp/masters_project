import { chai } from 'meteor/practicalmeteor:chai';
import chaiAsPromised from 'chai-as-promised';
import schema     from 'js-schema';
import web3       from '/imports/lib/thirdparty/web3.js';
import ipfs       from 'ipfs-js';
import DB         from './db.js';

chai.use(chaiAsPromised);
const expect = chai.expect;


var addressSchema = schema({
  line1: String,
  line2: String,
  city: String,
  postcode: String,
  country: String
});

var userSchema = schema({
   'name'     : String,
   '?email'    : String,
   '?address'  : addressSchema
});

var userAddr = 'wooo'; //web3.eth.accounts[1];

describe('db', function() {

  before(function() {
    ipfs.setProvider({host: 'localhost', port: '5001'});
  });

  var db = {};

  beforeEach(function() {
    db = new DB();
  });

  it('should be exported as defined object', function() {
    expect(db).to.be.ok;
  });

  it('should set schema for user collection', function() {
    db.setUserSchema(userSchema);
    expect(db.getUserSchema()).to.equal(userSchema);
  });
  
  describe('setUserData', function() {

    it('should throw error if no schema exists', function() {
      var userData = {
        name: "jack"
      }
      return expect(db.checkUserData(userData)).to.be.rejected;
    });

    it('should throw an error if data does not match schema', function() {
      var userData = {
        name: 10
      }

      db.setUserSchema(userSchema);
      return expect(db.checkUserData(userData)).to.be.rejected;
    });

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

    it('should accept well defined schema data', function() {
      db.setUserSchema(userSchema);
      return expect(db.checkUserData(userData)).to.be.fulfilled;
    });

    it('should add user data to ipfs', function() {
      db.setUserSchema(userSchema);
      db.addToIPFS(userData).then(function(hash) {
        ipfs.catJson(hash, function(err, res) {
          if(err) {
            throw err
          }
          expect(userData).to.eql(res);
        })
      })
    });
        
  });
});
