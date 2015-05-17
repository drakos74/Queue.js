/**
 * Created by drakos on 5/17/15.
 */
var _html = (function () {
    "use strict"

    function encode(json) {
        return JSON.stringify(json);
    }

    function _http(type, url, options) {

        var options = options || {};

        var async = options.async ?
            true :
            false;

        var parameters = options.parameters ?
            encode(options.parameters) :
            null;

        var $http, response;

        if (async) {//promise
            var response = new Promise(function (resolve, reject) {

                $http = new XMLHttpRequest();

                $http.open(type.toUpperCase(), url, async);

                $http.onload = function () {
                    if ($http.status == 200) {
                        resolve($http.response); // we got data here, so resolve the Promise
                    } else {
                        reject(Error($http.statusText)); // status is not 200 OK, so reject
                    }
                };

                $http.onerror = function () {
                    reject(Error('Error fetching data.')); // error occurred, reject the  Promise
                };
                $http.send(parameters); //send the request
            });
        } else {//synchronous request
            $http = new XMLHttpRequest();
            $http.open(type.toUpperCase(), url, async)
            $http.send(parameters);
            response = $http.responseText;
        }
        return response;
    }


    return {
        web: function (url) {
            //make get request from node server!
            var response = _http('post', _is.Server(), {
                parameters: {
                    url: url
                },
                async: true
            });
            //if(is.String(response)){
            return response;
            //}
            //return false;
        },
        get: function (url, o) {
            if (url.indexOf('/') !== 0) {
                url = '/' + url;
            }
            return _http('get', _is.Server() + url, o);
        },
        post: function () {
            return _POST(url);
        }
    }
}());