
function mRate() {
  etm = eth.getBlock("latest").difficulty/miner.hashrate; // estimated time in seconds
  return Math.floor(etm / 3600.) + "h " + Math.floor((etm % 3600)/60) + "m " +  Math.floor(etm % 60) + "s";
}
