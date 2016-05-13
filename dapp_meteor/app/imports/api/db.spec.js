import { chai } from 'meteor/practicalmeteor:chai';
import chaiAsPromised from 'chai-as-promised';
import Promise        from 'bluebird';
import ipfsJs     from 'ipfs-js';
import DB from './db.js';

chai.use(chaiAsPromised);
const expect = chai.expect;

ipfs          = Promise.promisifyAll(ipfsJs);

describe('db', function() {

  before(function() {
  });

  it('should load ok', function() {

  });
});

