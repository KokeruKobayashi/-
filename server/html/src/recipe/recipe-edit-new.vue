<template>
<div id='recipe-edit-new' uk-modal bg-close='false' class='uk-modal-container'>
    <div class='uk-modal-dialog'>
        <div class="uk-modal-header">
           <h2 class="uk-modal-title">Add new procedure</h2>
        </div>
        <div class='uk-modal-body'>
            
                Device<br>
                    <input type='radio' v-model='deviceRadio' value='newDev' class='uk-radio'>
                    <input v-model.trim='newDeviceNew' type='text' placeholder='New' class='uk-input uk-width-1-3' @click='radioAutoCheck(0)'>
                    <input type='radio' v-model='deviceRadio' value='oldDev' class='uk-radio'>
                    <select v-model='newDeviceOld' class='uk-select uk-width-1-3' @click='radioAutoCheck(1)'>
                        <option disabled :value='""' selected>--existing device--</option>
                        <option v-for='(d,i) in newDeviceOldArray' :value='d' :key='i'>{{d}}</option>
                    </select>
                <br>
                Action
                    <select v-model='selectedAction' class='uk-select'>
                        <option disabled :value='{}' selected>--Action select--</option>
                        <option v-for='(d, i) in actionData' :value='d' :key="i">{{d.Action}}</option>
                    </select>
                <div v-show='detailFilter(selectedAction)'>  
                    Detail
                    <detailcomponent :selectedAction='selectedAction' :newDetailTemp.sync='newDetailTemp'
                    :newDetailUnitTemp.sync='newDetailUnitTemp'></detailcomponent>
                </div>
        </div>    
        <div class="uk-modal-footer uk-text-right">
            <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
            <button class="uk-button uk-button-primary uk-modal-close" type="button" @click='recipeEdit'>Add</button>
            <button class="uk-button uk-button-default" type="button" @click='testetete'>かくにん</button>
        </div>
    </div>

</div>
</template>

<script>

import detailcomponent from './recipe-edit-new-ditail.vue';

export default{
    props:['actionData','procedureData','experimentID'],

     components:{
       detailcomponent
    },

    data(){
        return{ 
            newDevice:'',
            newDetail:'',
            newDetailTemp:'',
            newDetailUnitTemp:'',
            newDeviceNew:'',
            newDeviceOld:'',
            deviceRadio:'',
            selectedAction:{},
        }
    },

    mounted(){
    },

    methods :{
        testetete(){
            this.newDetail= this.newDetailTemp + ' ' + this.newDetailUnitTemp;
            console.log(this.newDetail);

            switch(this.deviceRadio){
                case 'newDev':
                    this.newDevice = this.newDeviceNew;
                    break;
                case 'oldDev':
                    this.newDevice = this.newDeviceOld;
                    break;

            }
        },

        recipeEdit(){
            this.newDetail= this.newDetailTemp + ' ' + this.newDetailUnitTemp;
            switch(this.deviceRadio){
                case 'newDev':
                    this.newDevice = this.newDeviceNew;
                    break;
                case 'oldDev':
                    this.newDevice = this.newDeviceOld;
                    break;
            }

            this.$emit('actionEmit',this.newDevice,this.selectedAction,this.newDetail);
            this.newDevice = '';
            this.newDetail='';
            this.newDetailTemp='';
            this.newDetailUnitTemp='',
            this.newDeviceNew='',
            this.newDeviceOld='',
            this.deviceRadio='',
            this.selectedAction={};
        },

        detailFilter(action){
            switch(action.Argument){
                case 'wait' :
                    return true
                case '--irate' :
                    return true
                case '--wrate' :
                    return true
                default :
                    return false
            }
        },

        radioAutoCheck(num){
            if(num == 0){
                this.deviceRadio = 'newDev';
            }else{
                this.deviceRadio = 'oldDev';
            }
        },

        resetDeviceInfo(){
            //モーダルを開いた時に動く関数
            this.newDevice = '';
            this.newDetail='';
            this.newDetailTemp='';
            this.newDetailUnitTemp='',
            this.newDeviceNew='',
            this.newDeviceOld='',
            this.deviceRadio='',
            this.selectedAction={};

            this.deviceRadio = 'newDev';
        }
    },

    watch:{

    },

    computed:{
        newDeviceOldArray: function(){
            let experimentID = this.experimentID
            let aaaa = [...this.procedureData.filter(function(x){
                return x.ExperimentID == experimentID;
            })]
            let bbbb = [...aaaa].map(x => x.Device);
            bbbb.push('-');
            return [...new Set(bbbb)]
       },
    },
    
}

</script>
<style scoped lang='scss'>
  .recipe-infomation {
    display:inline-block;
    width: 5em;
  }

</style>