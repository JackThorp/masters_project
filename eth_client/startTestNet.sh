#!/bin/bash
geth --unlock 0x901e68f297e25f26f86546869b4943e6214b7300 --genesis test_genesis_block.json  --datadir ./.ethereum --networkid 123 --nodiscover --maxpeers 0  --rpc --rpcapi "personal,net,eth,web3" --rpccorsdomain "*" --mine --minerthreads="2" --verbosity 5 console 2>> $1

#geth --genesis test_genesis_block.json  --datadir ./.ethereum --networkid 123 --nodiscover --maxpeers 0 --rpc --rpcapi "personal,net,eth,web3" --rpccorsdomain "*" console 2>> $1
