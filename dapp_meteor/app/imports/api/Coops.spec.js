import { chai } from 'meteor/practicalmeteor:chai';
import chaiAsPromised from 'chai-as-promised';
import Promise    from 'bluebird';
import web3       from '/imports/lib/thirdparty/web3.js';
import ipfsJs     from 'ipfs-js';
import Coops      from './Coops.js';

chai.use(chaiAsPromised);
const expect = chai.expect;

ipfs          = Promise.promisifyAll(ipfsJs);

var userAddr = ''

describe('Coops', function() {

  before(function() {
    ipfs.setProvider({host: 'localhost', port: '5001'});
    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
    userAddr = web3.eth.accounts[4];
  });

  var coops = {};

  beforeEach(function() {
    coops = new Coops(ipfs, web3);
  });

  it('should be exported as defined object', function() {
    expect(coops).to.be.ok;
  });

  describe('get', function() {
    it('should get coop data from coop contract', function() {
       
    });
  });

 
});
