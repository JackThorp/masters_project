#!/bin/bash

# $1 = net
# $2 = console redirect.

case $1 in

  private )
    geth --ipcpath /Users/jackthorp/Library/Ethereum/geth.ipc --genesis test_genesis_block.json --datadir ./.ethereum --networkid 1387 --nodiscover --maxpeers 0  --rpc --rpccorsdomain "*" --mine --minerthreads="1" --verbosity 5 console 2>> $2
    ;;
  
  testnet ) 
    geth --testnet --rpc --rpccorsdomain "*" --datadir ~/.ethereum/testnet console 2> $2
    # geth --testnet --rpc --rpccorsdomain "*" --ipcpath /Users/jackthorp/Library/Ethereum/geth.ipc console 2> $2
    ;;

esac

# geth --unlock 0x901e68f297e25f26f86546869b4943e6214b7300 --genesis test_genesis_block.json  --datadir ./.ethereum --networkid 123 --nodiscover --maxpeers 0  --rpc --rpccorsdomain "*" --mine --minerthreads="1" --verbosity 5 console 2>> $1
#geth --genesis test_genesis_block.json  --datadir ./.ethereum --networkid 123 --nodiscover --maxpeers 0 --rpc --rpcapi "personal,net,eth,web3" --rpccorsdomain "*" console 2>> $1
