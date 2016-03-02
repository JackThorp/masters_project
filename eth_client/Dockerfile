FROM ethereum/client-go

RUN mkdir /src
WORKDIR /src

COPY . /src

ENTRYPOINT ["geth", "--genesis", "test_genesis_block.json", "--datadir", "./.ethereum", "--networkid", "123", "--nodiscover", "--maxpeers", "0", "--rpc", "--rpcaddr", "0.0.0.0", "--rpcapi", "personal,net,eth,web3", "--rpccorsdomain", "*"]
