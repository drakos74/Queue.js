/**
 * Created by drakos on 5/17/15.
 */
var module_4 = (function(module_2 , module_3){

    var module = module_2.test(module_3.myNonWritableProperty);

    return {
        start : function(){
            console.log("%c -> running start() in module_4", 'color:green');
            module.startProcessing();
        }
    }

}(module_2 , module_3));