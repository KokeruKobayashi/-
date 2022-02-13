<template>
<div class='uk-card uk-card-body uk-card-default'>
   Create new recipe : <button class='uk-button uk-button-default uk-margin-small-right' type='button' uk-toggle='target: #new-recipe'>New</button>
 <div>

   <!-- レシピ一覧表示 -->   
    <ul uk-accordion>
    <li v-for='a in recipeData' :key='a.id'>
        <a class='uk-accordion-title' href='#'>{{a.Title}}</a>

     <div class='uk-accordion-content'>
       <p class='uk-text-left uk-width-2-3'>
        <button class="uk-button uk-button-default uk-width-1-4 min-button-size-1" type="button" uk-toggle='target: #recipe-edit-new' @click='experimentIDis(a)'>Add</button>
        <button class="uk-button uk-button-default uk-width-1-4 min-button-size-2" type="button" uk-toggle='target: #recipe-edit' @click='recipeEditFilter(a)'>Edit</button>
        <button class="uk-button uk-button-primary uk-width-1-4 min-button-size-2" type="button" uk-toggle='target: #recipe-repeat'
        @click='recipeActionFilter(a)' v-if='!experimentTitle.isDoing'>Run</button>
        <button class="uk-button uk-button-primary uk-width-1-4" v-if='experimentTitle.isDoing' disabled>Run</button>
       </p>

       <p>Procedure</p>
      <table class="uk-table uk-table-hover uk-width-2-3">
        <thead>
          <tr>
            <th></th>
            <th>Device</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(b,index) in recipeFilter(a.ID)" class='procedure-order' :key='index'>
            <td>{{index+1}}</td>
            <td>{{b.Device}}</td>
            <td>{{b.Action}}</td>
            <td>{{b.Details}}</td>
          </tr>
        </tbody>
      </table>
      
      
   
     </div>    
     </li>
     </ul>

    <newrecipe @createRecipe='createRecipe'></newrecipe>
    <recipeaction :recipeAction='recipeAction' :recipeTitle='recipeTitle' :deviceData='deviceData' @experimentStart='experimentStart'></recipeaction>
    <recipeedit :recipeEditer='recipeEditer' :recipeTitle='recipeTitle' @recipeEdit='recipeEdit'></recipeedit>
    <recipeeditnew :actionData='actionData' :procedureData='procedureData' :experimentID='experimentID' @actionEmit='actionEmit' ref='recipeEditNew'></recipeeditnew>

</div>
</div>
</template>

<script>
import newrecipe from './newrecipe.vue'
import recipeaction from './recipe-action.vue'
import recipeedit from './recipe-edit.vue'
import recipeeditnew from './recipe-edit-new.vue'


export default{
    props:['recipeData','procedureData','deviceData','actionData','experimentTitle'],

    components:{
        newrecipe,
        recipeaction,
        recipeedit, 
        recipeeditnew,
    },
    
 
     data(){
        return{
          recipeAction:["0","1"], //配列の2番目を定義しないとrecipe-action.vueの方で[1] is undefinedと出る
          recipeTitle:'',
          recipeEditer:[],
          experimentID:'',
        }
    },

    methods :{
        createRecipe(a){
            this.$emit('createRecipe',a);
        },

        experimentStart(procedure,device){
          this.$emit('experimentStart',procedure,device);
        },

        //送られてくるのはレシピの配列
        recipeEdit(a){
           this.$emit('recipeEdit',a);
        },

        kakunin(){
          console.log(this.items);
          
        },

        recipeActionFilter(a){
          this.recipeAction.splice(0,1,a);
          this.recipeAction.splice(1,1, this.recipeFilter(a.ID));
          this.recipeTitle = a.Title;

          
        },

        recipeEditFilter(a){
          this.recipeEditer = [];
          this.recipeEditer.push(...this.recipeFilter(a.ID));
          this.recipeTitle = a.Title;
        },

        experimentIDis(a){
          this.experimentID = a.ID;
          this.$refs.recipeEditNew.resetDeviceInfo();
        },

        actionEmit(device,action,detail){
          this.$emit('actionEmit',device,action,detail,this.experimentID);
        },

    },

    computed:{
        //computedに引数渡すのはmethodと同じようにはいかない
        recipeFilter:function(){
            return function(a){
            const data = this.procedureData;
            const result = data.filter(x => x.ExperimentID === a);
            
            result.sort(function(first,second){
              if(first.ProcedureOrder > second.ProcedureOrder){
                return 1;
              }else if(first.ProcedureOrder < second.ProcedureOrder){
                return -1;
              }else{
                return 0;
              }
            });

            return result
            };
        },
    },
}
</script>
<style>
    .min-button-size-1{
        min-width: 120px;
    }
    .min-button-size-2{
        min-width: 90px;
    }
</style>