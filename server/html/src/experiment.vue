<template>
<div class="uk-card uk-card-body uk-card-default">
    <h4 v-show='!experimentTitle.isDoing'>Experiment is not running</h4>
    <div v-show='experimentTitle.isDoing'>
    <ul uk-accordion>
      <li class='uk-open'>
        <a class='uk-accordion-title' href='#'>{{experimentTitle.Title}}</a>
        <div class='uk-accordion-content'>
          <p  class='uk-width-2-3'> 
            <span class='run-infomation'>RunNumber</span>: {{runInfo.ID}}<br>
            <span class='run-infomation'> Date</span>: {{runInfo.Starting_date}}<br>
            <span class='run-infomation'> Comment</span>: {{runInfo.Comment}}<br>
            <a href='#new-comment' uk-toggle @click='commentSet'>Add comment</a>
          </p>      
        </div>
      </li>
    </ul>
     <div v-show='experimentTitle.isDone'><span uk-icon="icon: check; ratio:1.2"></span>Done</div>
     <button class="uk-button uk-button-danger" uk-toggle='target: #experiment-quit'>Finish this experiment</button>
     <div v-show='!experimentTitle.isDone && !isBreak'><span uk-spinner='ratio:0.7'></span>Running</div>
     <div v-show='isBreak'><span uk-icon='icon: minus-circle'></span>Breaking</div>
     <p></p>
    <div v-if='!isBreak && !experimentTitle.isDone'>
      <button class="uk-button uk-button-danger" type="button" @click='procedureBreak'>Break</button>
      <button class="uk-button uk-button-default" disabled>Resume</button>
    </div>
    <div v-if='isBreak && !experimentTitle.isDone'>
      <button class="uk-button uk-button-danger" disabled>Break</button>
      <button class="uk-button uk-button-default"  @click='procedureRestart'>Resume</button>
    </div>
    <div v-if='experimentTitle.isDone'>
      <button class="uk-button uk-button-danger" disabled>Break</button>
      <button class="uk-button uk-button-default"  disabled>Resume</button>
    </div>
    
      <table class="uk-table uk-table-hover uk-width-2-3">
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th>Device</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(b,index) in experimentRecipe" :key='b.ID'>
            <td>{{index+1}}</td>
            <td><span v-show='b.isDone' uk-icon="icon: check"></span></td>
            <td>{{b.Device}}</td>
            <td>{{b.Action}}</td>
            <td>{{b.Details}}</td>
          </tr>
        </tbody>
      </table>
    </div> 


    <div id='new-comment' uk-modal>
    <div class='uk-modal-dialog uk-modal-body'>
        <h2 class='uk-modal-title'>Add comment</h2>
        <textarea v-model.trim='runComment' type='text' style="width:400px; height:200px" class='uk-textarea'></textarea><br>
        <p class='uk-text-right'>
        <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
        <button class="uk-button uk-button-primary uk-modal-close" @click='commentSubmit' type="button">OK</button> 
      </p>
    </div>
    </div>

    <div id='experiment-quit' uk-modal>
      <div class='uk-modal-dialog uk-modal-body'>
        <h2 class='uk-modal-title'>Finish this experiment</h2>
        <p>Are you sure you want to finish?</p>
        <p class='uk-text-right'>
          <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
          <button class="uk-button uk-button-danger uk-modal-close" @click='experimentDone' type="button">OK</button> 
      </p>
      </div>
    </div>
</div>
</template>

<script>
export default {
  props:['experimentTitle','experimentRecipe','runInfo'],

  data(){
    return{
      isBreak:false,
      runComment:this.runInfo.Comment,
    }
  },

  methods :{
    testex(){
      console.log('あ');
      isBreak = true;
    },

    procedureBreak(){
      this.isBreak =　true;
      this.$emit('procedureBreak',this.isBreak);
    },

    procedureRestart(){
      this.isBreak = false;
      this.$emit('procedureBreak',this.isBreak);
    },

    isBreakGet(flag){
      this.isBreak = flag;
    },

    commentSubmit(){
      this.$emit('commentSubmit',this.runComment,this.runInfo.ID);
    },

    commentSet(){
      this.runComment=this.runInfo.Comment;
    },

    experimentDone(){
      this.$emit('experimentDone');
    }
  },
}
</script>
<style scoped lang='scss'>
  .run-infomation {
    display:inline-block;
    width: 6em;
  }
</style>