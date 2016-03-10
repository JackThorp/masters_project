#!/bin/bash
geth --unlock 0x65d572badce26e0c8b755199784fb277319f5dad --genesis test_genesis_block.json  --datadir ./.ethereum --networkid 123 --nodiscover --maxpeers 0  --rpc --rpcapi "personal,net,eth,web3" --rpccorsdomain "*" console 2>> $1

#geth --genesis test_genesis_block.json  --datadir ./.ethereum --networkid 123 --nodiscover --maxpeers 0 console 2>> $1
