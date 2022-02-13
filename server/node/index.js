const mysql = require('mysql');

var dbsrv = {
  host: 'localhost',
  user: '****',
  password: '****',
  database: 'dbserver',
  timezone: 'utc',
  dateStrings: 'date'
}

var cors = {
  cors: true,
  origins: ["http://10.249.80.69", "http://localhost"],
  methods: [ "GET", "POST"]
}

var srvUser = require('socket.io')(8000, cors);//htmlに表示させるほう
var client = [];
client[0] = require('socket.io')(8010, cors);//ラズパイからデータをもらうほう

var con = mysql.createConnection(dbsrv);

var deviceList = [];

//実験進行中用
var experimentRecipe = [];
var experimentDevice = {};
var experimentTitle = {};
var isExperimentQuit = false; 
var isBreak = false;
var breakProcedure = {};
var date;
var waitingTimer;
var runInfo = {};

///0823///
const { EventEmitter } = require('events');
const ev = new EventEmitter();
//////


let procedureNumber = 0;
//実験進行中の共通のプログラム
function experimentDoing(clientRes){
if(!isExperimentQuit){  
  //console.log(clientRes.res);
  procedureNumber = clientRes.procedure.ProcedureOrder;

  //終わった手順のisDoneフラグをtrueに&送信
  experimentRecipe[procedureNumber-1].isDone = true;
  srvUser.emit('experimentRecipe',experimentRecipe);

if(!isBreak){//中断フラグたっているか否か
  if(procedureNumber < experimentRecipe.length){
    let usedDevice =experimentDevice[experimentRecipe[procedureNumber].Device];
    
    //デバイス名がある場合
      if(experimentRecipe[procedureNumber].Device !== '-'){
        //console.log(usedDevice);
        client[usedDevice.ClientNumber].emit('experimentDoing',{procedure:experimentRecipe[procedureNumber], usedDevice:usedDevice});
    
      }else{//待ちの手順の場合(デバイス名が'-'で分岐　これよりActionがwaitで分岐するほうが良いかも)
        var time = 1000 * parseFloat(experimentRecipe[procedureNumber].Details);
        waitingTimer = setTimeout(experimentDoing,time,{res:'Timeout待ち',procedure:experimentRecipe[procedureNumber]});
        //
      }
    
    }else{
      //手順が全て終わり
      experimentTitle.isDone = true;
      console.log('done');
      srvUser.emit('experimentTitle',experimentTitle);
  }
}
  //中断されたときに備えて直近の手順(clientRes)を保存しておく
  breakProcedure = clientRes;
}else{
 
}

};



//ラズパイからデバイスリストのデータを受け取る
//いまのところはまだclient[0]のみ 、まあforloopとかで回せばいいか
client[0].on('connection', (socket)=>{
  console.log(" connected from a client");
  //console.log(socket.id);

  socket.on('disconnect', () => {
    deviceList = deviceList.filter( (d) => {return d.socket != socket.id });
    srvUser.emit('deviceList', deviceList);
  });

  socket.on('deviceList', (d) => {
    deviceList.push( {socket: socket.id, client: d});
    srvUser.emit('deviceList', deviceList);
  });

  /*
  ///0823///
  var fn = function(){
    socket.emit('measure',socket.id); 
  };
  
  
  socket.emit('measure',socket.id); 
  setInterval(fn,5000);
  

  socket.on('measurementResult', (ond) => {
    console.log(ond);
    //srvUser.emit('sokutei', ondo);
    //↑この書き方は機能しない
    ev.emit('nanana',ond);
  });
  //////
  */

  //コマンドラインを表示できるようにする
  socket.on('commandLine', (a) =>{
    console.log('コマンドラインだよ');
    console.log(a);
    srvUser.emit('commandLine',a)
  });

  //experimentResを受け取る
  socket.on('experimentRes',function(a){
    //リザルトはとりあえず正規表現で加工すればよろし
    //グローバル関数(どのclientでも共通)に投げる
    //中断のフラグが立っていたら次に進まない
    experimentDoing(a);
    });
  
  ///0131///
  socket.on('testmeasurementResult',(a)=>{
    srvUser.emit('testmeasurementResult', a);
  });

  socket.on('clientActionResult', (result,device) => {
    srvUser.emit('clientActionResult', result,device);
  });

});


//htmlに表示させる準備
srvUser.on('connection', (socket)=>{
  //実験手順一覧を送信
  function getRecipeProcedure(){
    con.query(`select a.ID,a.ExperimentID, a.Device,a.ProcedureOrder,a.Details, b.Action,b.Argument
    from Experimentalprocedure a
    inner join Action b on a.ActionID = b.ID;`,(err,res,fields) =>{
      socket.emit('recipeProcedure',res);
    });
   };

  console.log(" connected from a user");

  socket.emit('deviceList', deviceList);
  getRecipeProcedure()
  socket.emit('experimentTitle',experimentTitle);
  socket.emit('experimentRecipe',experimentRecipe);
  socket.emit('isBreakFlag',isBreak);
  socket.emit('runInfo',runInfo);

  ///0823///
  /*
  ev.on('nanana',(ond) => {
    socket.emit('sokuteiResult2',ond);
    });
    */
   //////

   //レシピタイトル
   con.query('select * from Experiment',(err,res,fields) =>{
     socket.emit('recipeList', res);
   });

   //Actionリスト
   con.query('select * from Action order by ID asc',(err,res,fields) =>{
     socket.emit('actionList',res);
   });

   //新しいレシピタイトルの作成
   socket.on('createRecipe', function (p) {
    con.query("insert into Experiment (Title) values (?)", [p], (err, res, fields) => {
      con.query("select * from Experiment ", [p], (err, res, fields) => {
        socket.emit("recipeList", res);
      });
    });
  });
  

//レシピの順番の変更に対応
  socket.on('recipeEdit',function(a){
    let recipeString = 'update Experimentalprocedure set\nprocedureOrder = case ID';
    let recipeStringIn = '';
      
      // katarao no sugoi code
      //join methodは配列の要素を連結する
      // const sss = a.map(aa => aa.id).join()

      // for(aa of a) {
      //   aa.ID
      // }
      for(let i = 0; i < a.length; i++){
        let z = i + 1
        recipeString += '\nwhen '+ a[i].ID + ' then ' + z;
        recipeStringIn += a[i].ID +','; 
      }
      recipeStringIn = recipeStringIn.slice(0,-1);
      recipeString += '\nend';
      recipeString += '\nwhere ID in(' + recipeStringIn + ');';
      console.log(recipeString);

      con.query(recipeString,(err,res,fields) =>{
        //更新したレシピリストを送信
        getRecipeProcedure();
      });
  });

  socket.on('recipeEditNew',function(device,action,detail,exID){
    const arr = Array.from({ length:6},() => null);
    arr[1] = exID;
    arr[3] = action.ID;
    if(device.length !== 0 ){
      arr[2] = device;
    }
    if(detail.length !== 0 ){
      arr[5] = detail;
    }

    //手順No.がわからないからとりあえずIDと一緒にするよ
    con.query('select max(ID) from Experimentalprocedure',(err,res,feilds)=>{
      var res2 = Object.values(JSON.parse(JSON.stringify(res)));
      arr[4] = res2[0]['max(ID)'] + 1;
      con.query('insert into Experimentalprocedure values (?)',[arr],(err,res,fields)=>{
        getRecipeProcedure()
      });
      
    });
    
    
  });

  //Runのコメントを追加
  socket.on('commentSubmit',function(comment,runNumber){
    con.query('update Run set Comment= ? where ID= ?',[comment,runNumber],(err,res,fields)=>{
      con.query('select * from Run where ID = ?',runNumber,(err,res,fields)=>{
        socket.emit('commentGet',res[0]);
        runInfo = res[0];
      });
    });
  });

  //1102実験を自動化するぞ
  //recipeは[0]がタイトル、[1]が手順
  socket.on('experimentStart',function(recipe,device){
    //console.log(recipe);
    console.log(device);
    experimentDevice = device;
    experimentRecipe = recipe[1];
    experimentTitle = recipe[0];
    //実験が完了したかどうかのフラグ
    experimentTitle.isDone = false;
    //実験が進行中か否かのフラグ
    experimentTitle.isDoing = true;
    //前回の実験を途中でやめたかどうかをリセット
    isExperimentQuit = false;
 
    experimentRecipe.forEach(item =>{
      item.isDone = false;
    });
    socket.emit('experimentTitle',experimentTitle);
    socket.emit('experimentRecipe',experimentRecipe);

    //Runを記録
    date = new Date();
    date = date.getFullYear() + '-' +
        ('00' + (date.getMonth()+1)).slice(-2) + '-' +
        ('00' + date.getDate()).slice(-2) + ' ' + 
        ('00' + date.getHours()).slice(-2) + ':' + 
        ('00' + date.getMinutes()).slice(-2) + ':' + 
        ('00' + date.getSeconds()).slice(-2);
    console.log(date);

    var sqlState = [experimentTitle.ID,date];
    con.query('insert into Run (ExperimentID,Starting_date) values (?)',[sqlState],(err,res,fields)=>{
      con.query('select * from Run where Starting_date = ?',date,(err,res,fields)=>{
        //console.log(res[0]);
        socket.emit('runInfo',res[0]);
        runInfo = res[0];
      });
    });
    
    

    //一個目を動かす
    let usedDevice =device[experimentRecipe[0].Device];
    client[usedDevice.ClientNumber].emit('experimentDoing',{procedure:experimentRecipe[0], usedDevice:usedDevice});
  });

  //中断フラグを受け取る
  socket.on('procedureBreak',function(flag){
    isBreak = flag;
    if(flag){
      clearInterval(waitingTimer);
      
    }else{
      experimentDoing(breakProcedure);
    }
  });

  socket.on('experimentDone',function(){
    experimentDevice = {};
    experimentRecipe = [];
    experimentTitle = {};
    isBreak = false;
    breakProcedure = {};
    runInfo = {};
    clearInterval(waitingTimer);
    isExperimentQuit = true;
    socket.emit('experimentDoneReturn')

  });

  socket.on('testMeasurement',function(){
    console.log('MEASUREのボタンが押されたイベントを受け取り、機器側に送信します');
    client[0].emit('testMeasurementClient');
  });
  
  socket.on('clientAction', function (action) {
    client[action.ClientNumber].emit('clientAction', action);
  });

});




