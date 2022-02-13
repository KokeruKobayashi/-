<template>
<div class="uk-card uk-card-body uk-card-default">
<h3 v-if="isConnect">Server connected</h3>
<h3 v-if="!isConnect"><font color='#4d47ff'>Sever disconnected</font></h3>

<ul class="uk-subnav uk-subnav-pill" uk-switcher>
  <li> <a href="#"> Client List </a> </li>
  <li> <a href="#"> Receipe List </a> </li>
  <li> <a href='#'> Experiment </a></li>
  <li><a href='#'>RESULT</a></li>
  <li><a href='#'>SETTING</a></li>
    <li> <a href='#'> NEW </a></li>
</ul>

<ul class="uk-switcher uk-margin">
  <li>  <client-list :deviceData='clientDeviceList' @clientAction="clientAction" :clientActionResultValue="clientActionResultValue"></client-list>
  </li>
  <li>  <recipe-list :recipeData=recipeList :actionData=actionList @createRecipe=createRecipe 
  :procedureData=recipeProcedure :deviceData=deviceList 
  @experimentStart='experimentStart' @recipeEdit='recipeEdit'
  :experimentTitle='experimentTitle' @actionEmit='actionEmit'></recipe-list>
  </li>
  <li><experiment ref='experimentChild' :experimentTitle='experimentTitle' :experimentRecipe='experimentRecipe'
  @procedureBreak='procedureBreak' :runInfo='runInfo' @commentSubmit='commentSubmit'
  @experimentDone='experimentDone'></experiment></li>
  <li><runlist></runlist></li>
  <li><setting></setting></li>
  <li><fortest @testMeasurement="testMeasurement" :testmeasurementResultValue="testmeasurementResultValue"></fortest></li>
</ul>

</div>
</template>


<script>
import clientList from './client-list.vue';
import recipeList from './recipe/recipe-list.vue';
import experiment from './experiment.vue';
import runlist from './run/run-list.vue';
import setting from './setting.vue';
import io from 'socket.io-client';
import fortest from './fortest.vue';
import ui from 'uikit';


var cors = {
  cors: true,
  origins: ["http://10.249.80.69", "http://localhost"],
  methods: [ "GET", "POST"]
}

export default {
  components: {
   clientList,
   recipeList,
   experiment,
   fortest,
   runlist,
   setting,
  },
  data () {
    return {
      status: 0,
      deviceList: [],
      recipeList: [],
      actionList:[],
      clientDeviceList:[],
      recipeProcedure:[],
      experimentTitle:{},
      experimentRecipe:[],
      runInfo:{},
      socket: null,
      isConnect: false,
      
      testmeasurementResultValue: null,
      clientActionResultValue:{
        result:null,
        device:null,
      },
    }
  },

  mounted(){
    //this.socket=io.connect('http://' + window.location.host + ':8000');
    this.socket=io.connect('http://localhost:8000');
   
    this.socket.on('connect', () => {
      console.log("connected to server as user");
      this.isConnect = true;

    });

    this.socket.on('disconnect', () => {
      console.log("disconnected from server");
      this.isConnect = false;
      this.deviceList = [];
          });

    
    this.socket.on('deviceList', (d) => {
      this.deviceList = d; 
      this.clientDeviceList = d;     
    });

    this.socket.on('sokuteiResult2',(ondo) => {
      console.log(ondo);
    });

    this.socket.on('recipeList',(a) => {
      this.recipeList = a;   
    });

    this.socket.on('recipeProcedure',(a) =>{
      this.recipeProcedure = a;
    });

    this.socket.on('experimentTitle',(title) =>{
      this.experimentTitle = title;
    });

    this.socket.on('experimentRecipe',(procedure) =>{
      this.experimentRecipe = procedure;
    });

    this.socket.on('actionList',(a)=>{
      this.actionList = a;
    });

    //再読込した際に中断か否かをExperiment.vueに送信する
    this.socket.on('isBreakFlag',(flag) =>{
      this.$refs.experimentChild.isBreakGet(flag);
    });

    this.socket.on('runInfo',(a)=>{
      this.runInfo = a;
    });

    this.socket.on('commentGet',(a)=>{
      this.runInfo = a;
    });

    this.socket.on('experimentDoneReturn',()=>{
      //実験が終わったので各々の情報をリセット
      Object.keys(this.experimentTitle).forEach(key => {
        this.$delete(this.experimentTitle,key);
      });
      Object.keys(this.runInfo).forEach(key => {
        this.$delete(this.runInfo,key);
      });
      this.experimentRecipe.splice(0,this.experimentRecipe.length);
    });

    this.socket.on('testmeasurementResult',(a)=>{
      this.testmeasurementResultValue = a;
    });

    this.socket.on('clientActionResult',(result,device)=>{
      this.$set(this.clientActionResultValue,'result',result);
      this.$set(this.clientActionResultValue,'device',device);
    })
  },

  methods :{
    test(){
      console.log('あ');
      ui.switcher('.uk-subnav').show(2);
    },

    testMeasurement(){
      this.socket.emit('testMeasurement');
    },

    createRecipe(a){
      if(this.isConnect === true){
      console.log('create Recipe');
      this.socket.emit('createRecipe',a);
      alert('正常に追加されました');
      }else{
        alert('作成に失敗しました\nサーバーとの接続を確認してください');
      };
    },

    experimentStart(recipe,device){
      if(this.isConnect === true){
      console.log('Experiment Starting');
      this.socket.emit('experimentStart',recipe,device);
      ui.switcher('.uk-subnav').show(2);
      //alert('正常に送信されました');
      }else{
        alert('実行に失敗しました\nサーバーとの接続を確認してください');
      };
    },

    recipeEdit(a){
       if(this.isConnect === true){
      console.log('procedure Edited');
      this.socket.emit('recipeEdit',a);
      alert('正常に送信されました');
      }else{
        alert('実行に失敗しました\nサーバーとの接続を確認してください');
      };
    },

    procedureBreak(isBreak){
      this.socket.emit('procedureBreak',isBreak);
    },

    commentSubmit(comment,runNumber){
       if(this.isConnect === true){
        this.socket.emit('commentSubmit' ,comment,runNumber);
      }else{
        alert('実行に失敗しました\nサーバーとの接続を確認してください');
      };
    },

    experimentDone(){
      this.socket.emit('experimentDone');
    },

    actionEmit(device,action,detail,exID){
      this.socket.emit('recipeEditNew',device,action,detail,exID)
    },

    clientAction(action){
      this.socket.emit('clientAction',action);
    }
  },

}
</script>
