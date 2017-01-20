# AppEvent

A basic nodejs app container to build evented apps with env/argv based configuration.

Only 3 events, `load`, `ready`, `start`.

Suits you if :

 - You like almost non-existant APIs. 
 - Conventions over configuration.
 - Don't mind using `process` global to setup an event-based application.
 - System based configuration regarding `process.env` merged with `.env` file on the root folder, 
and finally overrided by `yargs` command line arguments.
 - De facto PM2/PMX deployment/integration to abstract process usage & metrics (not required)
 - out-of-the box JSON logging (bunyan compliant) with trace to stderr & stdout
 - runtime command using PM2 `trigger` actions


# usage


A basic usage 


```javascript
var start = require('appevent')();

/*
    Register module on load
 */
process.once('load', function MyModule() {
    
    /*
        Do some registration works
     */
    process.args.FOO_BAR = {
        description: 'Do something great',
        default: "nope"
    };

});

/*
    Add another module that just have to bind itself to `load`, `ready`, `start`
 */ 
process.on('load', require('my-middleware').load);


/* 
    configuration/registration done
    eventually inform other module or passing an API
 */
process.on("ready", function () {
    process.emit('load:mymodule', {
        myApi: () => {}, // custom api method;
    });
});


/*
    On start you can start your servers 
 */
process.once('start', function () {

    /*
        All configuration & dependencies merged,  
        you can use config to setup your module
     */
    console.log(process.env.FOO_BAR);

});



/*
    start app
 */ 
start();

```
