# masters project
Masters project on Ethereum and the distributed web

ethereum_experiments contains scripts for setting up a private ethereum test network as well as some simple contracts. The keystore is added for personal convenience, it does not hold any sensitive information, the password for the accounts is 'pass'.

## How to run private network
- ./startTestNet.sh <stdout channel> runs the go ethereum client with the test genesis block. It is nice to pass the name of a second terminal to redirect stdout from the client. Use tty to obtain this. 
- once on geth console, miner.start(n) can be used to start the miner with 'n' threads.
- miner.stop() will terminate the miner. 

Credits:
How to create a private ethereum chain - http://adeduke.com/2015/08/how-to-create-a-private-ethereum-chain/


