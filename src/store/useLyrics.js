import {defineStore} from "pinia";
import {ref} from "vue";

export const useLyrics = defineStore('lyrics',()=>{
    const lyrics = ref('가나다라');

    return {
        lyrics,
    }
});