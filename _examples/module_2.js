/**
 * Created by drakos on 5/17/15.
 */
var module_2 = (function(module_1){

    var module = new module_1();

    return {
        test : function(a){
            console.log("%c -> running test() in module_2" , 'color:green');
            module.init(a);
            return module;
        }
    }
}(module_1));