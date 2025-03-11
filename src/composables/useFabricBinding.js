import {watch} from "vue";

export function useFabricBinding(fabricCanvas, fabricObj, bindings){
    Object.entries(bindings).forEach(([key,state])=>{
        watch(state,(newValue)=>{
            if(fabricObj){
                fabricObj.set(key,newValue);
                fabricCanvas.renderAll();
            }
        });
    })
}