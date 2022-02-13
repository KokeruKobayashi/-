const mysql = require('mysql');
//const exec = require('child_process').exec;//シェルコマンドの実行
const util = require('util');//execをawaitさせる
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

var clientdata = {
  name : "Raspberry pi NO1",
};

var dbparam = {
  host: 'localhost',
  user: 'kii001',
  password: 'kyodai',
  database: 'db00',
}

var cors = {
  cors: true,
  origins: ["http://10.249.80.69", "http://localhost"],
  methods: [ "GET", "POST"]
}


var srv = require('socket.io')(8002, cors);
var io = require('socket.io-client');
var con = mysql.createConnection(dbparam);

//クライアントの番号を登録()
//ここでクライアントの番号を登録しておくことでレシピ実行時の送信先を簡単に指定できる
var clientNumber = 0;
var client0 = io.connect('http://localhost:8010');

var soushin = [];

const spaceArg = ' ';

//直接やり取り(使ってない/過去の遺物)
srv.on('connection', function(socket){

  console.log(" got connection");

  /*テスト用のデバイスリスト
  con.query("select * from devices", (err, res, fields) => {
    console.log(res);
    socket.emit("deviceList", res);
  });
  */

  con.query("select * from param", (err, res, fields) => {
    console.log(res);
    socket.emit("paramList", res);
  });


  socket.on('mycommand', function () {
    console.log(" get command");
    socket.emit('mycommandres' , { text: "yes"});
  });

  socket.on('destroyParam', function (p) {
    console.log(" get destroyParam");
    console.log(p);

    con.query("delete from param where param = ? ", [p], (err, res, fields) => {

      con.query("select * from param ", [p], (err, res, fields) => {
        socket.emit("paramList", res);
      });
    });
  });

  socket.on('createParam', function (p) {
    con.query("insert into param (param, value) values (?, ?)", [p.param, p.text], (err, res, fields) => {
      con.query("select * from param ", [p], (err, res, fields) => {
        socket.emit("paramList", res);
      });
    });
  });

  socket.on('measure', function (p) {
    console.log(p);
    exec("python3 a.py", (err, stdout, stderr)=>{
      console.log(stdout);
    });
  });
/*
    con.query("insert into param (param, value) values (?, ?)", [p.param, p.text], (err, res, fields) => {
*/

});

function experimentDoingExec(a){
  exec("python3 ./script/"+a.usedDevice.ID+'_'+ a.usedDevice.Device+'_'+a.usedDevice.Company +".py" + " "+a.procedure.Argument,(err,stdout,stderr)=>{
    if(stdout){
      client0.emit('experimentRes',{res:stdout,procedure:a.procedure});
     }else{
       client0.emit('experimentRes',{res:'not connected',procedure:a.procedure});
     }
  });
}

//サーバーとの通信
client0.on('connect', ()=>{
   console.log("connected to server");

      ///Device取得　コマンドラインヘルプつなげる
      //0927 vueでsplitするのではなくこっちでスプリットしたやつを渡す
      con.query("select * from Device", (err, res, fields) => {
        soushin = res;
         async function main(){
        for (let sss of soushin){
          let resExec = await exec("python3 ./script/"+sss.ID+'_'+ sss.Device+'_'+sss.Company +".py" + " " + "-h")
          sss.HelpUsage = resExec.stdout.split("optional arguments:")[0].match(/(?<=\[).*?(?=\])/g);
          sss.HelpArgument = resExec.stdout.split("optional arguments:")[1].match(/(?<= {2}.* {2,})\S.*?(?=\n)/g);
          sss.HelpUsage = sss.HelpUsage.splice(1);
          sss.HelpArgument = sss.HelpArgument.splice(1);
          sss.ClientNumber = clientNumber;
        };
      };  
      
      main().then(() => {
        client0.emit("deviceList", {clientData: clientdata, deviceList : soushin});
        //console.log({clientData: clientdata, deviceList : soushin});
        //console.log(soushin);
      });
    });

    });

    function experimentDoingExec(a){
      exec("python3 ./script/"+a.usedDevice.ID+'_'+ a.usedDevice.Device+'_'+a.usedDevice.Company +".py" + " "+a.procedure.Argument+''+a.procedure.Details,(err,stdout,stderr)=>{
        if(stdout){
          client0.emit('experimentRes',{res:stdout,procedure:a.procedure});
         }else{
           client0.emit('experimentRes',{res:'not connected',procedure:a.procedure});
         }
      });
    }

     ///0823///
     //測定コマンド送信テスト
     client0.on('measure', (p) => {
      exec("python3 ./script/drivermain.py", (err, stdout, stderr)=>{
        console.log(stdout);
       if(stdout){
        client0.emit('measurementResult',stdout);
       }else{
         client0.emit('measurementResult','not connected')
       }
        });
      });
      //////
      
    //実験実行時の送信先
    //送られてくるデータの形式 : a{procedure,usedDevice}
    client0.on('experimentDoing',(a) =>{
      //console.log(a.procedure);
      //console.log(a);
      //console.log('↓パイソンコマンド');
      //console.log("python3 ./script/"+a.usedDevice.ID+'_'+ a.usedDevice.Device+'_'+a.usedDevice.Company +".py" + " "+a.procedure.Argument);
      experimentDoingExec(a);
    });

    ///0131///
    //温度計のテスト
    client0.on('testMeasurementClient',()=>{
      exec("python3 ./script/4_thermometer_OMRON.py --get", (err, stdout, stderr)=>{
        console.log('現在の温度 :'+stdout);
       if(stdout){
        client0.emit('testmeasurementResult',stdout);
       }else{
         client0.emit('testmeasurementResult','error')
       }
        });
    });

    client0.on('clientAction', (a) => {
      exec("python3 ./script/" + a.ID + '_' + a.Device + '_' + a.Company + ".py" + " " + a.HelpUsage, (err, stdout, stderr) => {
        if (stdout) {
          console.log(stdout);
        client0.emit('clientActionResult',stdout,a);
        } else {
          console.log(err);
          client0.emit('clientActionResult', 'error', a);
        }
      });
    });

    







