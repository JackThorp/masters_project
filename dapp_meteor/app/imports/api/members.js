import { Mongo }        from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Meteor }       from 'meteor/meteor';
import _                from 'lodash';

import contracts          from '/imports/startup/contracts.js';
import Helpers            from '/imports/lib/helpers/helperFunctions.js';


const Members = new Mongo.Collection('members', {connection: null});

export { Members };

let AddressSchema = new SimpleSchema({
  line1: {
    type: String,
    max: 100
  },
  line2: {
    type: String,
    max: 100
  }, 
  city: {
    type: String,
    max: 50
  },
  postCode: {
    type: String,
    max: 10
  },
  country: {
    type: String,
    max: 30
  }
});

Members.schema = new SimpleSchema({
  name:   { type: String },
  email:  { type: String },
  address: { type: AddressSchema }
});
 
Members.attachSchema(Members.schema);

Members.helpers({});

Members.init = function() {

};

Members.addMember(userAddr, 
