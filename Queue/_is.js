/**
 * Created by drakos on 5/17/15.
 */
var _is = (function () {
    "use strict"

    var isTypealiasOf = function (type, value, force) {
        return (typeof value === type);
    }

    var I = function (a) {
        return a;
    }

    var O = function(){
        return true;
    }

    var Sources = Object.create({}, {});

    return {
        I : function(a){
          return a ? O : I;
        },
        String: function (a, y) {
            return isTypealiasOf('string', a) || y;
        },
        Array: function (a, y) {
            if (isTypealiasOf('object', a) && Array.isArray(a)) {
                return y ? a : true;
            }
            if(y && isTypealiasOf('string',a)){
                a = a.split(y);
                return _is.Array(a,true)
            }
            return y ? [] : false;
        },
        _Source: function (sources) {
            Sources = sources;
        },
        Source: function (a,y) {
            var source = Sources[a];
            if(!source){
                source = Object.keys(Sources).reduce(function(_source , key){
                    var script = Sources[key];
                    if(!_source && script.path === a || script.name === a){
                        _source = script;
                    }
                    return _source;
                },null);
            }
            return source ? (y ? source : source.path) : false;
        },
        Server : function(){
            //return my static server !
            return  window.location.origin;//'http://localhost:8080';
        },
        safe: function (value) {
            if (_is.String(value)) {
                return value.replace(/(\w+\/)/gi, '').replace(/(\.\w+)/, '');
            }
            return false;
        },
        token: function () {
            return (Math.random() * new Date().getTime()).toString(36).toUpperCase().replace(/\./g, '-');
        },
        trace : function(e){
            var stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
                .replace(/^\s+at\s+/gm, '')
                .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
                .split('\n');
            stack.reverse();
            return stack.join(' -> ');
        }
    }
}());