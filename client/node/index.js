const mysql = require('mysql');
//const exec = require('child_process').exec;//シェルコマンドの実行
const util = require('util');//execをawaitさせる
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);

//const serverAdress = '100.111.186.122';
const serverAdress = 'localhost';

var clientData = {
  name : null,
  detail : null,
};

var dbparam = {
  host: 'localhost',
  user: '****',
  password: '****',
  database: 'dbclient',
}

var cors = {
  cors: true,
  origins: ["http://10.249.80.69", "http://localhost"],
  methods: [ "GET", "POST"]
}


var srv = require('socket.io')(8002, cors);
var io = require('socket.io-client');
var con = mysql.createConnection(dbparam);

//var client = io.connect('http://localhost:8010');
var serverURL = 'http://' + serverAdress + ':8010';
var client = io.connect(serverURL);

var soushin = [];

const spaceArg = ' ';
const pythonArg = 'python3 ./script/'

//定常待ちについての情報 //上4つはmainから送られてくる
let tempErr = 0.25 //どれくらいの誤差を許容するか ℃
let maxNumber = 30 //何回取得したら定常とみなすのか
let interval = 10 //取得のインターバル second
let maxTime = 3600 //最大何秒定常待ちするか
let dTemp = 0.7 //一度この差だけ低い温度で温度到達を待つ　
let sstateProcedure = {}; //手順情報を一時保存しておく
let startTimeA = null; //温度昇温を初めた時間(achievement)
let startTimeS = null; //定常状態待ちを初めた時間(Steadystate)
let sstateProcedureOrder = null;

let emargencyStopScript = [];
let monitorScript = [];
let monitorInterval = 5;//status監視の時間間隔[s]

//サーバーとの通信
client.on('connect', ()=>{
   console.log("connected to server");

   con.query("select * from raspberrypi_informations",(err,res,fields) => {
     if(err){
      clientData.name = 'NoName';
      clientData.detail = null;
      return
     };
     if(res.length == 0){
      clientData.name = 'NoName';
      clientData.detail = null;
      return 
     }
     clientData.name = res[0].name;
     clientData.detail = res[0].detail;
   });

      ///Device取得　コマンドラインヘルプつなげる
      //0927 vueでsplitするのではなくこっちでスプリットしたやつを渡す
      con.query("select * from devices order by device asc", (err, res, fields) => {
        soushin = res;
        
        async function main(){
        for (let sss of soushin){
          if(sss.Script !== 'NoScript'){
            let resExec = await exec(pythonArg + sss.script + " " + "-h")
            sss.HelpUsage = resExec.stdout.split("optional arguments:")[0].match(/(?<=\[).*?(?=\])/g);
            sss.HelpArgument = resExec.stdout.split("optional arguments:")[1].match(/(?<= {2}.* {2,})\S.*?(?=\n)/g);
            sss.HelpUsage = sss.HelpUsage.splice(1);
            sss.HelpArgument = sss.HelpArgument.splice(1);
          }else{
            sss.HelpUsage = null;
            sss.HelpArgument = null;
          };
          
        };
      };  
      
      main().then(() => {
        client.emit("deviceList", {clientData: clientData, deviceList : soushin});
        //console.log({clientData: clientdata, deviceList : soushin});
        //console.log(soushin);
      });
    });

});

function experimentDoingExec(a) {
  if (a.procedure.usedDetail == null) {
    if (a.procedure.argument == "--sample") {
      exec(pythonArg + a.usedDevice.script + " " + a.procedure.argument + " " + a.samplingTime, (err,stdout,stderr) => {
          client.emit('experimentRes',{res:stdout,procedure:a.procedure});
      });
    } else {
      exec(pythonArg + a.usedDevice.script + " "+a.procedure.argument,(err,stdout,stderr)=>{
      if(stdout){
        client.emit('experimentRes',{res:stdout,procedure:a.procedure});
        }else{
          client.emit('experimentRes',{res:'not connected',procedure:a.procedure});
        }
      });
      }
    } else {
      if (a.procedure.argument == "--setrun") {
        exec(pythonArg + a.usedDevice.script + " "+a.procedure.argument+' '+a.lowTemp,(err,stdout,stderr)=>{
          if(stdout){
            client.emit('experimentRes',{res:stdout,procedure:a.procedure});
            }else{
              client.emit('experimentRes',{res:'not connected',procedure:a.procedure});
            }
        }); 
      } else {
      exec(pythonArg + a.usedDevice.script + " "+a.procedure.argument+' '+a.procedure.usedDetail,(err,stdout,stderr)=>{
          if(stdout){
            client.emit('experimentRes',{res:stdout,procedure:a.procedure});
            }else{
              client.emit('experimentRes',{res:'not connected',procedure:a.procedure});
            }
       }); 
      }
  }
}
//実験実行時の送信先
client.on('experimentDoing',(a) =>{//送られてくるデータの形式 : a{procedure,usedDevice, lowTemp,samplingTime}
  experimentDoingExec(a);
});

function waitTempAchievement(targetT, script, nowT = 20, lowTemp){ //温度の初期値は20度にしておく
  var nowTime = new Date();
  var timeDiff = nowTime - startTimeA;
  timeDiff = Math.round(timeDiff);
  console.log("現在の温度  " + nowT + "  lowTemp "+ lowTemp)

  //安全ストップほしいなあ

  if((lowTemp-0.05) <= nowT || timeDiff> 1000 * 4 * maxTime){
    startTimeS = new Date();
    waitTempFor(targetT, script);
  }else{
      exec(pythonArg + script + " --get ",(e,r,f)=>{
      //例外処理もないと詰む errorを吐き出すだけではなくて、それをmainに知らせる処理など
      if(e){
          console.log("error")
      };
      //温度を抽出
      let t = Number(r.match(/\d+(?:\.\d+)?/))
      client.emit('sstateNow',{temp:t, timeDiff:Math.round(timeDiff/1000), procedureOrder:sstateProcedureOrder});
      setTimeout(function(){waitTempAchievement(targetT,script,t, lowTemp)},1000 * interval);
      });
  }
  
};

function waitTempFor(targetT, script) {
  var nowTime = new Date();
  var timeDiff = nowTime - startTimeS
  var timeDiffOld = Math.round((nowTime - startTimeA)/1000)
  if (timeDiff < 1000 * 60 * 5) {
      exec(pythonArg + script + " --get ",(e,r,f)=>{
      if(e){
          console.log("error")
      };
      //温度を抽出
      let t = Number(r.match(/\d+(?:\.\d+)?/))
      console.log("現在の温度2  " + t)
      client.emit('sstateNow',{temp:t, timeDiff:timeDiffOld, procedureOrder:sstateProcedureOrder});
      setTimeout(function(){waitTempFor(targetT,script)},1000 * interval);
      });
  } else {
    exec(pythonArg + script + " --set " + targetT, (e, r, f) => {
      if (e) {
        console.log(e);
      }
        waitTempSteadystate(targetT, script, 0)
      });
  }
}

function waitTempSteadystate(targetT, script, count = 0){
  var nowTime = new Date();
  var timeDiff = nowTime - startTimeS
  var timeDiffOld = Math.round((nowTime - startTimeA)/1000)
  timeDiff = Math.round(timeDiff);
  if(count >= maxNumber || timeDiff > 1000 * maxTime){
      //emitする 時間経過が超過した場合も
    client.emit('finishSteadyState', { res: 'success', procedure: sstateProcedure, timeElapsed: timeDiffOld });
      startTimeA = null;
      startTimeS = null;
      sstateProcedure = {};
      return
  };

  exec(pythonArg + script + " --get ",(e,r,f)=>{
    //例外処理もないと詰む
    if(e){
        console.log("error")
    };

    //温度を抽出
    let t = Number(r.match(/\d+(?:\.\d+)?/));
    console.log(count + " " + t + " ℃ " + timeDiffOld);
    
    client.emit('sstateNow', { temp: t, timeDiff: timeDiffOld, procedureOrder: sstateProcedureOrder });
    if(Math.abs(t - targetT) > tempErr){//誤差がでかいとき
    setTimeout(function(){waitTempSteadystate(targetT,script,0)},1000 * interval);
    }else{//誤差が許容内
    setTimeout(function(){waitTempSteadystate(targetT,script,(count + 1))},1000 * interval);
    }
  });
};

client.on('judgeSteadyState',(a) =>{//a = {procedure:experimentRecipe[procedureNumber], usedDevice:usedDevice, time:time}
  sstateProcedureOrder = a.procedure.procedureOrder; //一時保管 !!!同じラズパイで恒温槽を複数つなげたら不具合が生じる
  sstateProcedure = a.procedure;
  tempErr = a.time.tempErr; 
  maxNumber = a.time.maxNumber;
  interval = a.time.interval;
  maxTime = a.time.maxTime;
  dTemp = a.time.dTemp;
  console.log("onJudge");
  console.log("maxTime = " + maxTime);
  console.log("T = " + a.usedDevice.tempSetting)
  exec(pythonArg + a.usedDevice.script + " --get ",(err,res,fie)=>{
    let t = Number(res.match(/\d+(?:\.\d+)?/));
    var lowTemp = a.usedDevice.tempSetting - a.time.dTemp;
    console.log(lowTemp)
    startTimeA = new Date();
    waitTempAchievement(a.usedDevice.tempSetting, a.usedDevice.script, t,lowTemp);
  });
});

client.on('emargencyStopReset', () => {
  emargencyStopScript = [];
});

client.on('monitorReset', () => {
  monitorScript = [];
});

client.on('getEmargencyStopScript', (command) => {
  emargencyStopScript.push(command);
});

client.on('getMonitorScript', (command) => {
  monitorScript.push(command);
});

function emargencyStop() {
  emargencyStopScript.forEach(function (command) {
    exec(pythonArg + command, (e, r, f) => {
      if (e) {
        console.log(e);
      }
    });
  })
};

client.on('emargencyStop', () => {
  emargencyStop();
});

function monitorStatus(){
    monitorScript.forEach(function(command){
      exec(pythonArg + command, (e, r, f) => {
        if (e) {
          console.log(e);
        }else{
          if(r.indexOf('ERROR') != -1){
            console.log(r);
            clearInterval(setMonitorInterval);
            client.emit("clientExitProcess")//他のclientのoffコマンドを実行する
            emargencyStop();
          }else{
            console.log(command + " OK");
          }
        }
      });
    })
}

let setMonitorInterval;
client.on('startMonitorStatus',()=>{
  setMonitorInterval = setInterval(monitorStatus,monitorInterval * 1000);
});

client.on('clearMonitorStatus',()=>{
  clearInterval(setMonitorInterval);
});

client.on('clientAction', (a) => {
  exec(pythonArg + a.script + " " +  a.HelpUsage, (err, stdout, stderr) => {
    if (stdout) {
    client.emit('clientActionResult',stdout,a);
    } else {
      console.log(err);
      client.emit('clientActionResult', 'error', a);
    }
  });
});

//異常終了時の処理
process.on("exit", (a) => {
  emargencyStop();
  client.emit("clientExitProcess")//他のclientのoffコマンドを実行する
});
