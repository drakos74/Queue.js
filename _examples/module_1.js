/**
 * Created by drakos on 5/17/15.
 */
function module_1(){
    this.username = null;
    return this;
}

module_1.prototype.init = function(username){
    //..some init code
    this.username = username;
    console.warn('%c I am initialized as an instance of module_1 with username '+username , 'background:black;color:white');
    console.log('%c '+_is.trace(new Error('dummy')),'background:black;color:white');
}

module_1.prototype.startProcessing = function(){
    console.warn('%c I will use my username to do something productive . . . ' , 'background:black;color:white');
    console.log('%c '+_is.trace(new Error('dummy')),'background:black;color:white');
}

console.log("%c -> module_1 with Class 'module_1' initialized.", 'color:green');