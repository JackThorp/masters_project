# Go-op
Go-op is a PoC dapp (distributed application) for cooperative governance built using Ethereum & IPFS. For more information see report.pdf.

## Prerequisites
Runnning go-op locally requires installation of:
- IPFS (see https://ipfs.io/)
- Geth (see https://github.com/ethereum/go-ethereum) and/or testrpc (see https://github.com/ethereumjs/testrpc)
- Meteor (see https://www.meteor.com/)

## How to run Go-op
- Start the IPFS daemon
- Start an ethereum client using the `startTestNet.sh` script in the `eth_clients` directory.
- Start the app by running `meteor` inside the `dapp_meteor/app/` directory
