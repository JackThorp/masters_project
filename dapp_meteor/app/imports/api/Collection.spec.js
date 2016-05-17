import { chai } from 'meteor/practicalmeteor:chai';
import chaiAsPromised from 'chai-as-promised';
import Promise    from 'bluebird';
import web3       from '/imports/lib/thirdparty/web3.js';
import ipfsJs     from 'ipfs-js';
import Collection from './Collection.js';

chai.use(chaiAsPromised);
const expect = chai.expect;

var userAddr = ''

describe('Collection', function() {

  before(function() {
    ipfs.setProvider({host: 'localhost', port: '5001'});
  });

  var coops = {};
  describe('ipfsToEth', function() {
    it('should be last 32 bytes of multihash', function() {
       
    });
  });

 
});
