/client/index.js
//0916ラズパイにつながっているデバイスリストを取得
 con.query("select * from Device", (err, res, fields) => {
  soushin = res;

  //コマンドラインのヘルプを取得
  async function getHelp(){
  res.forEach(function(value,index,array){
    exec("python3 ./script/" + res[index].Script + " " + "-h", (err, stdout, stderr)=>{
      if(stdout){
      soushin[index].Help = stdout;
      console.log('forEachのなか');
      console.log(soushin[0].Help);
     }else{
       console.log('コマンドラインエラー');
     }
     });
  });
  return true;
  };

  function emitDevice(){
  //  socket.emit("deviceList", {client: clientdata, deviceList : soushin});
    console.log('全然待たんやん' + soushin[0].Help);
  };

  async function deviceEmitProcess(){
    await getHelp();
    emitDevice();
  };

  deviceEmitProcess();
});


////promise関数を使う
function f1(){
  return new Promise((resolve,reject) => {
    con.query("select * from Device", (err, res, fields) => {
      soushin = res;
      console.log(soushin);
        for (let s of soushin){
          exec("python3 ./script/" + s.Script + " " + "-h", (err, stdout, stderr)=>{
            if(stdout){
            s.Help = stdout;
            console.log('forEachのなか');
            console.log(s.Help);
           }else{
             console.log('コマンドラインエラー');
           };
           });
        };
      });
      resolve('こんくえり')
  })
}
function f2(passVal){
  return new Promise((resolve,reject) => {
    console.log('全然待たんやん');
    resolve('えみっと')
})
}

function f3(passVal){
  return new Promise((resolve,reject) => {
  setTimeout(
      () => {
          console.log(passVal);            
          console.log("#3: f3");
          resolve("f3 ==> f4");
      }
       ,Math.random()*3000)
})
}

function f4(passVal){
  return new Promise((resolve,reject) => {
  setTimeout(
      () => {
          console.log(passVal);
          console.log("#4: f4");
          resolve("f4");
      }
        ,Math.random()*4000)
})
}



//f1->f2->f3->f4の順に実行
f1()
.then(f2)
.then(f3)
.then(f4)
.then((response)=> {
  console.log("Final function: "+response);
  console.log("[END]");
}
)




//nodejs(client)
var socket = io.connect('http://localhost:8010');

socket.on('connect', ()=>{
   console.log("connected to server");

   /*
   //ラズパイにつながっているデバイスリストを取得(テスト)
    con.query("select * from devices", (err, res, fields) => {
      console.log(res);
      socket.emit("deviceList", {client: clientdata, deviceList : res});
    });
*/

     ///0823///
     
     socket.on('measure', (p) => {
      exec("python3 ./script/drivermain.py", (err, stdout, stderr)=>{
        console.log(stdout);
       if(stdout){
        socket.emit('measurementResult',stdout);
       }else{
         socket.emit('measurementResult','not connected')
       }
        });
      });
      
      //////


      ///Device取得　コマンドラインヘルプつなげる
      //0927 vueでsplitするのではなくこっちでスプリットしたやつを渡す
      con.query("select * from Device", (err, res, fields) => {
        soushin = res;
         async function main(){
        for (let sss of soushin){
            let resExec = await exec("python3 ./script/"+sss.ID+'_'+ sss.Device+'_'+sss.Company +".py" + " " + "-h")
            sss.HelpUsage = resExec.stdout.split("optional arguments:")[0].match(/(?<=\[).*?(?=\])/g);
            sss.HelpArgument = resExec.stdout.split("optional arguments:")[1].match(/(?<= {2}.* {2,})\S.*?(?=\n)/g);
        };
      };  
      
    
      main().then(() => {
        socket.emit("deviceList", {clientData: clientdata, deviceList : soushin});
        //console.log({clientData: clientdata, deviceList : soushin});
        //console.log(soushin);
      });
      
    });


    });



    //1102実験を自動化するぞ
  socket.on('experimentStart',function(recipe,device){
    //これで一個は動かせるんだけど、複数ってなるとどう処理すればいいんだろう...
       let usedDevice =device[recipe[0].Device];
       client[usedDevice.ClientNumber].emit('experimentDoing',{procedure:recipe[0], usedDevice:usedDevice});
   
       /*
       //普通にfor文でまわすのならこうだけど、同期処理無理そう...
       for(let i;i< recipe.length; i++ ){
         let usedDevice =device[recipe[i].Device];
         client[usedDevice.ClientNumber].emit('experimentDoing',{procedure:recipe[i], usedDevice:usedDevice});
       }
       */
   
   
     });
   
     //experimentStartの返答
     //これ、イベントエミッター使えばうまくいくんじゃね?
     //aで、測定ならそのリザルトとか返ってくる
     //ある配列をつくってそこに実行結果とisDoneフラグでも作ってemitすれば良い
     //この配列をつくるのはexperimentstartの段階で必要な数だけ作ればよいか
     //みんなisDoneフラグはfalseからはじめて、データにはnullでも入れておけば
     socket.on('experimentRes',function(a){
   
       });
   


//client index.js 何故か指示したら(pages参照)コマンドが増殖する問題を抱えたプログラム
//実験実行時の送信先
    //送られてくるデータの形式 : a{procedure,usedDevice}
    client0.on('experimentDoing',(a) =>{
      console.log('手順その1 (client)');
      console.log(a);
      console.log('↓パイソンコマンド');
      console.log("python3 ./script/"+a.usedDevice.ID+'_'+ a.usedDevice.Device+'_'+a.usedDevice.Company +".py" + " "+a.procedure.Argument);

      async function mainExperimentDoing(){
        let resExec = await exec("python3 ./script/"+a.usedDevice.ID+'_'+ a.usedDevice.Device+'_'+a.usedDevice.Company +".py" + " "+a.procedure.Argument)
        console.log('asyncの中');
        console.log(resExec);
        console.log(qaz);
        qaz +=1;
        return resExec.stdout;
      };
      
        mainExperimentDoing().then((res) => {
          client0.emit('experimentRes',res);
          
        });
      

    });