import { chai } from 'meteor/practicalmeteor:chai';
import chaiAsPromised from 'chai-as-promised';
import schema     from 'js-schema';
import web3       from '/imports/lib/thirdparty/web3.js';
import ipfs       from 'ipfs-js';
//import { db }     from './db.js';

chai.use(chaiAsPromised);
const expect = chai.expect;

