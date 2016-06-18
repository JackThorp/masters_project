#!/bin/bash

# $1 = net
# $2 = console redirect.

case $1 in

  private )
    geth --ipcpath /Users/jackthorp/Library/Ethereum/geth.ipc --genesis test_genesis_block.json --datadir ./.ethereum_demobk --networkid 1387 --nodiscover --maxpeers 0  --rpc --rpccorsdomain "*" --mine --minerthreads="1" --verbosity 5 console 2>> $2
    ;;
  
  testnet ) 
    geth --testnet --rpc --rpccorsdomain "*" --datadir ~/.ethereum/testnet console 2> $2
    # geth --testnet --rpc --rpccorsdomain "*" --ipcpath /Users/jackthorp/Library/Ethereum/geth.ipc console 2> $2
    ;;
  
  testrpc )
    testrpc \
      --account="0x24745767ecbe8236661524b825d9fee8d1a5a72bdcd9cb7ac314928067ac499c,500000000000000000000000000000000" \
      --account="0x4ef2b6aa3cbade46a986b4c477de0115d6473c2c88e5562267054b2e7fff4e71,50000000000000000000000000000000" \
      --account="0x26a0704539e9d273f19fcedfb4f157d8acdfd46395b6434f13b99fe1adfea278,50000000000000000000000000000000"
    ;;
esac

# geth --unlock 0x901e68f297e25f26f86546869b4943e6214b7300 --genesis test_genesis_block.json  --datadir ./.ethereum --networkid 123 --nodiscover --maxpeers 0  --rpc --rpccorsdomain "*" --mine --minerthreads="1" --verbosity 5 console 2>> $1
#geth --genesis test_genesis_block.json  --datadir ./.ethereum --networkid 123 --nodiscover --maxpeers 0 --rpc --rpcapi "personal,net,eth,web3" --rpccorsdomain "*" console 2>> $1
