import web3 from '../lib/thirdparty/web3.js' 
let MembershipController = web3.eth.contract([{"constant":false,"inputs":[{"name":"_coop","type":"address"}],"name":"getMembersOf","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_coop","type":"address"}],"name":"leaveCoop","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_member","type":"address"}],"name":"getCoopsOf","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_coop","type":"address"}],"name":"joinCoop","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_coop","type":"address"},{"indexed":false,"name":"_member","type":"address"},{"indexed":false,"name":"_memberID","type":"uint256"}],"name":"Registered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_coop","type":"address"},{"indexed":false,"name":"_member","type":"address"},{"indexed":false,"name":"_memberID","type":"uint256"}],"name":"Unregistered","type":"event"}]); 
export default MembershipController;