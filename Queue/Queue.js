/**
 * Created by drakos on 5/17/15.
 */

var Queue = (function (_is, _html) {
    "use strict";

    /*
     *  QUEUE- interface!
     *  MUST have NO dependencies!!!
     *
     * */

    var timeout = false;

    var queues = {
        procs: {},
        script: {}
    };

    var find = Object.create({}, {
        inWindow: {
            value: function (a) {
                return window[a];
            }
        }
    });

    var load = Object.create({}, {
        scripts: {
            value: function (a) {
                var _this = this;
                var $ = document;
                var head = document.getElementsByTagName('head')[0];
                a.forEach(function (src) {
                    _this.script(src, $, head);
                });
            }
        },
        script: {
            value: function (src, $ /* document */, head /* <head> */) {
                var _this = this;
                $ = $ || document;
                head = head || $.getElementsByTagName('head')[0];
                src = _is.Source(src);
                _html.get('/' + src, {async: true})
                    .then(function (_script) {

                        //check dependencies of script!

                        var dependencies = _script.match(/\}\((.*?)\)\)\;/);//end of script injection variables
                        dependencies = (dependencies) ? _is.Array(dependencies[1], ',').map(function (dependency) {
                            return dependency.replace(/\s/g, '');
                        }) : [];

                        var require = [];
                        dependencies.length && dependencies.forEach(function (script) {
                            script = _is.Source(script,true);
                            script && require.push(script);

                        });

                        if (require.length) {
                            Queue.require(require).then(function () {
                                //load script into DOM -> execute
                                var script = $.createElement('script');
                                script.type = 'text/javascript';
                                script.innerHTML = _script;
                                script.setAttribute('id', _this.id);
                                head.appendChild(script);
                            });
                        } else {
                            //load script into DOM -> execute
                            var script = $.createElement('script');
                            script.type = 'text/javascript';
                            script.innerHTML = _script;
                            script.setAttribute('id', _this.id);
                            head.appendChild(script);
                        }
                    },function(e){
                        console.error(e);
                    });
            }
        },
        css: {
            value: function (url, $ /* document */, head /* <head> */) {
                $ = $ || document;
                head = head || $.getElementsByTagName('head')[0];

                var link = $.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = url;
                link.setAttribute('token', [sanitize(url), genex.token()].join('.'));
                head.appendChild(link);
            }
        },
        after: {
            value: function () {
                //console.log(this);
            }
        }
    });

    function Proc(token, module) {
        this.token = token;
        this.module = module;

        this.timeout = false;
        this.interval = false;

        this.promise = false;

        this.id = [module, token].filter(function (a) {
            return a;
        }).join('.');
        queues.procs[this.id] = this;
        return this;
    }

    /*
     * executes function
     * and adds to processes
     * */
    Proc.prototype.exec = function (fn, args) {
        var _this = this;
        fn.apply(_this, args);
        return this;
    }

    /*
     * checkes for functional condition
     * returns Promise (_.methods)
     * */
    Proc.prototype._check = function (fn, args) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this._repeat(fn, args)
                .then(function (a) {
                    resolve(a);
                }, function (e) {
                    reject(e);
                });
        });
        return promise;
    }

    /*
     * repeates until condition of fn is met
     * returns promise (_.methods)
     * */
    Proc.prototype._repeat = function (fn /*  ,args . . . */) {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        var promise = new Promise(function (resolve, reject) {
            _this.timeout && (clearTimeout(_this.timeout));
            _this.interval = setInterval(function () {
                console.warn(' . . . searching for : ' + args);
                //console.log(args[0][0]);
                var returnValue = fn.apply(_this, args);
                if (returnValue) {
                    clearInterval(_this.interval);
                    clearTimeout(_this.timeout);
                    resolve(returnValue);
                }
            }, 100);
            _this.timeout = setTimeout(function () {
                clearInterval(_this.interval);
                reject(' . . . ! could not load : ' + args);
            }, 5000);
        })
        return promise;
    }

    return {
        require: function (o) {

            var localqueue = [];
            var all = _is.Array(o, true);

            var promise = new Promise(function (resolve, reject) {
                var rejectTimeout = setTimeout(function () {
                    reject([]);
                }, 3000);

                var checkqueue = function (a) {
                    if (a) {
                        localqueue.push(a);
                    }
                    if (localqueue.length === all.length) {
                        clearTimeout(rejectTimeout);
                        return true;
                    }
                    return false;
                }

                all.map(function (o) {
                    switch (o.type) {
                        case 'script':
                            if (queues.script[o.name]) {//script already loaded
                                console.log('script ' + o.name + ' is already loaded');

                                checkqueue(queues.script[o.name]) && resolve(localqueue);

                            } else {//script is not available
                                if (queues.script[o.name] === 0) {//already loading
                                    console.log('script ' + o.name + ' is loading');
                                    Queue.check(o.name).then(function (a) {
                                        checkqueue(a) && resolve(localqueue);
                                    })
                                } else {//not loading!
                                    queues.script[o.name] = 0;
                                    Queue.load(o.path).then(function (a) {
                                        queues.script[o.name] = a;
                                        checkqueue(a) && resolve(localqueue);
                                    })
                                }

                            }
                            break;
                    }
                });
            });
            return promise;
        },
        check: function (global_variable, findWith) {//Promise

            findWith = findWith || find.inWindow;

            var args = Array.prototype.slice.call(arguments);

            //new Process.repeat ... until => promise
            var promise = new Promise(function (resolve, reject) {
                Proc
                    .prototype._check.apply(Proc.prototype, [findWith, global_variable])
                    .then(function (scriptClass) {//return of find.inWindow
                        resolve(scriptClass)
                    });
            });
            return promise;
        },
        exec: function (/*fn, (args , . , . , . ) ,condition*/) {//execute gracefully upon conditional
            var args = Array.prototype.slice.call(arguments);
            var condition = _is.I(true);
            var fn = _is.I();
            if (args[args.length - 1] instanceof Function) {
                condition = args.pop();
            }
            if (args[0] instanceof Function) {
                fn = args.shift();
            }
            var token = _is.token();
            var process = new Proc(token);
            process._check(find.inWindow, [condition()]).then(function (InvokedFunction) {
                //InvokedFunction.apply(args);
                switch (typeof fn) {
                    case 'string':
                        fn = fn.split('.');
                        fn = fn.reduce(function (funcObject, stringMethod) {
                            if (funcObject[stringMethod]) {
                                return funcObject[stringMethod];
                            } else {
                                return funcObject;
                            }
                        }, window)
                        break;
                }
                fn instanceof Function && process.exec(fn, args);
            });
        },
        load: function (src, type) {

            var args = Array.prototype.slice.call(arguments);

            var module = _is.safe(src,true);

            var token = _is.token();

            var process = new Proc(token, module);

            var promise = new Promise(function (resolve, reject) {
                process
                    .exec(load.script, args)
                    ._check(find.inWindow, [process.module])
                    .then(function (scriptClass) {
                        load.after.apply(process, args);
                        resolve(scriptClass)
                    },function(e){
                        reject(e);
                    });
            });
            return promise;
        },
        execute: function (exec, args) {//execute function
            switch (typeof exec) {
                case 'string':
                    var exec = exec.split('.');
                    if (window[exec[0]] && window[exec[0]][exec[1]] instanceof Function) {
                        return window[exec[0]][exec[1]](args);
                    }
                    break;
            }
        }
    }

}(_is, _html));

