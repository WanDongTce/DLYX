const network = require("../../../utils/network.js");
const app = getApp();


Component({
    properties: {
        imgList: Array
    },
    data: {
    },
    attached() {
    
    },
    methods: {
        hideFullImg(){
            this.triggerEvent('hideFullImg');
        }
    }
})
