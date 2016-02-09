var argv = require('yargs')
               .usage('Usage: $0 <command> (options)')
               .demand(1)

               .command('init [name]', 'start a new project')
               .command('compile [contract] [-s]', 'compile contract in contract folder')
               .command('upload contract [-s]', 'upload contract to blockchain')
               .command('create', 'create a new [project|module]')
               .command('genkey', 'generate a new private key and fill it at the faucet')
               //.command('register', 'register your app with BlockApps')
               .command('send', 'start prompt, transfer (amount*unit) to (address)')
               .command('start', 'start bloc as a webserver with live reload')
               .argv;

module.exports.argv = argv;
