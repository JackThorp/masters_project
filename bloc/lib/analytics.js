'use strict';

var Insight = require('insight');
var pkg = require('../package.json');
var chalk = require('chalk');
var exports = module.exports = {};

var insight = new Insight({
    // Google Analytics tracking code 
    trackingCode: 'UA-62294342-3',
    pkg: pkg
});

insight.insightMsg = function(){
    return chalk.gray('==========================================================================') +
    chalk.yellow('\nWe\'re constantly looking for ways to make ') + chalk.bold.red(pkg.name) +
    chalk.yellow(
      ' better! \nMay we anonymously report usage statistics to improve the tool over time? \n' +
      'More info: https://github.com/blockapps/bloc & http://blockapps.net'
    ) +
    chalk.gray('\n==========================================================================');
};

insight.trackEvent = function(eventName) {
    if (!insight.optOut){
        switch (eventName) {
            case "init":
                insight.track('bloc', 'init');
                break;
            case "register":
                insight.track('bloc', 'register');
                break;
            case "genkey":
                insight.track('bloc', 'genkey');
                break;
            case "compile":
                insight.track('bloc', 'compile');
                break;
            case "upload":
                insight.track('bloc', 'upload');
                break;
            case "start":
                insight.track('bloc', 'start');
                break;
            default:
                break;
        }
    }
}

exports.insight = insight;