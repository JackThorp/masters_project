#!/bin/bash
# Resets the blockchain but keeps the keystore. This means test_genesis_block.json still refers
# to existing accounts.
rm -rf ./.ethereum/chaindata
rm -rf ./.ethereum/dapp
rm -rf ./.ethereum/history
rm -rf ./.ethereum/geth.ipc
rm -rf ./.ethereum/nodekey
