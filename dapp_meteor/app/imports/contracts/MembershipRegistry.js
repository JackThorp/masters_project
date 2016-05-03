import web3 from '../lib/thirdparty/web3.js' 
let MembershipRegistry = web3.eth.contract([{"constant":false,"inputs":[{"name":"CMCAddr","type":"address"}],"name":"setCMCAddress","outputs":[{"name":"result","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_coop","type":"address"}],"name":"deregister","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_member","type":"address"}],"name":"getCoops","outputs":[{"name":"","type":"address[]"}],"type":"function"},{"constant":true,"inputs":[{"name":"_coop","type":"address"},{"name":"_member","type":"address"}],"name":"idOf","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"_coop","type":"address"}],"name":"getMembers","outputs":[{"name":"","type":"address[]"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"toID","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"memberToCoops","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"_coop","type":"address"}],"name":"totalMembers","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[],"name":"remove","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_user","type":"address"},{"name":"_coop","type":"address"}],"name":"register","outputs":[{"name":"memberID","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"sender","type":"address"},{"name":"name","type":"bytes32"}],"name":"checkSender","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"coopToMembers","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"numMembers","outputs":[{"name":"","type":"uint256"}],"type":"function"}]); 
let MembershipRegistryCode  = "0x60606040526107ca806100126000396000f3606060405236156100a35760e060020a600035046321b523dd81146100a5578063352e6245146100e257806336ce6289146101075780633795caae1461013457806378544629146101575780638dafa4ce146101845780639df5b95a146101a8578063a32a054e146101e4578063a7f4377914610204578063aa6773541461022c578063ab90cae11461024f578063ed4ee5dd146102f3578063f0b88e5f1461032f575b005b61034760043560008054600160a060020a031681148015906100d55750805433600160a060020a03908116911614155b156103c0575060006103d6565b6100a36004356024356000600061063f336000805160206107aa833981519152610259565b6103596004356040805160208101909152600081526106ca336000805160206107aa833981519152610259565b6103476004356024356000610749336000805160206107aa833981519152610259565b61035960043560408051602081019091526000815261064a336000805160206107aa833981519152610259565b60046020818152903560009081526040808220909252602435815220546103479081565b6103a360043560243560036020526000828152604090208054829081101561000257506000908152602090200154600160a060020a0316905081565b6103476004356000610780336000805160206107aa833981519152610259565b6100a360005433600160a060020a03908116911614156103e557600054600160a060020a0316ff5b61034760043560243560006103e7336000805160206107aa833981519152610259565b6103476004356024355b60008054600160a060020a031681146103db578054604080517fec56a373000000000000000000000000000000000000000000000000000000008152600481018590529051600160a060020a03929092169163ec56a37391602481810192602092909190829003018187876161da5a03f11561000257505060405151600160a060020a03908116908516141590506103db575060016103df565b6103a360043560243560016020526000828152604090208054829081101561000257506000908152602090200154600160a060020a0316905081565b61034760043560026020526000908152604090205481565b60408051918252519081900360200190f35b60405180806020018281038252838181518152602001915080519060200190602002808383829060006004602084601f0104600f02600301f1509050019250505060405180910390f35b60408051600160a060020a03929092168252519081900360200190f35b5060008054600160a060020a0319168217905560015b919050565b5060005b92915050565b565b15156103f2576103df565b600160a060020a038216600090815260016020819052604090912080549182018082558280158290116104485781836000526020600020918201910161044891905b808211156104975760008155600101610434565b505050600160a060020a0383166000908152600160208190526040909120805491820180825592935091828183801582901161049b5781836000526020600020918201910161049b9190610434565b5090565b50505060009283525060208083209091018054600160a060020a03191686179055600160a060020a0385168252600390526040902080546001810180835582818380158290116104fe578183600052602060002091820191016104fe9190610434565b50505060009283525060208083209091018054600160a060020a03191685179055600160a060020a03938416808352600482526040808420969095168352948152838220839055938152600290935291208054600101905590565b600160a060020a0383811660008181526004602090815260408083209489168352938152838220549282526001905291909120805491935090839081101561000257906000526020600020900160009054600160a060020a03858116600090815260016020526040812080546101009590950a9093049091169350918490811015610002579060005260206000209001600081546101009190910a928302600160a060020a039384021990911617905583811660009081526002602090815260408083208054600019019055600482528083209388168352929052908120555b50505050565b151561055957610639565b1515610655576103d6565b600160a060020a038216600090815260016020908152604091829020805483518184028101840190945280845290918301828280156106be57602002820191906000526020600020905b8154600160a060020a031681526001919091019060200180831161069f575b505050505090506103d6565b15156106d5576103d6565b600160a060020a038216600090815260036020908152604091829020805483518184028101840190945280845290918301828280156106be57602002820191906000526020600020908154600160a060020a031681526001919091019060200180831161069f575b505050505090506103d6565b1515610754576103df565b50600160a060020a038281166000908152600460209081526040808320938516835292905220546103df565b151561078b576103d6565b50600160a060020a0381166000908152600260205260409020546103d6566d656d62657273686970436f6e74726f6c6c6572000000000000000000000000";
export {MembershipRegistry, MembershipRegistryCode }