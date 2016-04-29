import { Web3 } from 'meteor/ethereum:web3';

// Make global to work with solc 
let web3 = new Web3();
export default web3;
