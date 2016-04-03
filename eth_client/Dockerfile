FROM ethereum/client-go

RUN mkdir /src
WORKDIR /src

COPY . /src

ENTRYPOINT ["geth", "--mine", "--etherbase", "8b990d2cb353d24b46bcde75c7815b8b558594ea", "--genesis", "test_genesis_block.json", "--datadir", "./.ethereum", "--networkid", "123", "--nodiscover", "--maxpeers", "0", "--rpc", "--rpcaddr", "0.0.0.0", "--rpcapi", "personal,net,eth,web3", "--rpccorsdomain", "*"]
