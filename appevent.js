/**
 * @author evaisse
 */
var restoreConsole = require('jsonconsole')();
var dotenv = require('dotenv').config({ silent: true });
var nconf = require('nconf');
var os = require('os');
var util = require('util');


var defaultConfig = {

    "NODE_ENV": {
        alias: "env",
        description: 'Global node env',
        default: "production"
    },

    "OUTPUT_VERBOSE": {
        alias: "verbose",
        description: 'Enable debug level output',
        default: false,
        type: "boolean",
    },

    "h": {
        description: "Show this help usage",
        type: "boolean",
    },

    "V": {
        description: "Show current version",
        type: "boolean"
    },

};




/*
    Build environment regarding
        1) process.env
        2) dotenv() overrdie regarding .env file on root dir
        3) argv values
 */
var buildEnvironmentConfig = function () {

    /*
        Assign env keys to config only assign 
        config that match a CONSTANT_FORM_PATTERN LIKE_THAT
     */
    nconf.env(Object.keys(process.args))
         .argv(process.args);

    /*
        Show help if needed
     */
    if (nconf.get('h')) {
        process.stdout.write(nconf.stores.argv.help());
        process.exit();
    }

    /*
        Stop command for some args
     */
    if (nconf.get('V')) {
        process.stdout.write(require(__dirname + '/package.json').version + os.EOL);
        process.exit();
    }

    /*
        rewrite only env keys
     */
    Object.keys(nconf.get())
          .filter((k) => k.match(/[A-Z0-9][A-Z0-9_]+[A-Z0-9]/))
          .forEach((key) => process.env[key] = nconf.get(key));

}



module.exports = function () {

    process.args = process.args || defaultConfig;

    process.once('ready', buildEnvironmentConfig);

    return function () {
        process.emit('boot');
        process.emit('ready');
        process.emit('start');
    };

};
