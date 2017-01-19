# AppEvent

A basic nodejs app container to build evented apps with env/argv based configuration.

 - Almost a non-existant API.
 - Basic wrapper around `process` global to setup an event-based application.
 - PM2/PMX integration to abstract process usage & metrics 
 - out-of-the box JSON logging with trace
 - runtime commands using PM2 `trigger`
 - system based configuration regarding `process.env` merged with `.env` file on the root folder, 
and finally overrided by `yargs` command line arguments.

# usage

A basic usage 


```javascript


var start = require('appevent')();

/*
    Register module on boot
 */
process.once('boot', function MyModule() {
    
    /*
        Do some registration works
     */
    process.args.FOO_BAR = {
        description: 'Do something great',
        default: "nope"
    };

    /* 
        configuration/registration done
        eventually inform other module or passing an API
     */
    process.on("ready", function () {
        process.emit('boot:mymodule', {
            myApi: () => {}, // custom api method;
        });
    });

    process.once('start', function () {

        /*
            All configuration & dependencies merged,  
            you can use config to setup your module
         */
        console.log(process.env.FOO_BAR);

    });

});

process.on('boot', require('my-middleware').boot);


/*
    start app
 */ 
start();

```
