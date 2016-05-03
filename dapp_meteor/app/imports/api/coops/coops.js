import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

//TODO Need to add persistant minimongo collection?
var CoopsCollection = new Mongo.Collection('coops', {connection: null});

// Imports are read only but adding const also means the value cannot be changed
// in this (the exporting) file either. 
export const CoopsCollection;
