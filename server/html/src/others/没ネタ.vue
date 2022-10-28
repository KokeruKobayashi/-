main.vue

 <!--
<div v-for="item in deviceList"> {{item.deviceList.client.name}} 
  <div v-for="item2 in item.deviceList.deviceList"> {{item2.hardware}} 
  </div>
-->

<!-- コマンドライン -->
<!--
<ul>
  <li v-for='a in coUsage'>{{a}}</li>
</ul>
<ul>
<li v-for='a in coArguments'>{{a}}</li>
</ul>
-->

//0922 DeviceListの表示
<div>{{deviceList[0].client.deviceList[0].Device}}</div>

<script>
//this.socket=io.connect('http://' + '10.249.80.69:8000');
    //this.socket=io.connect('http://' + 'localhost' + ':8000');
    //http://10.249.80.69/practice/0804/server/html

//0903コマンドラインを表示する
    this.socket.on('commandLine',(a) => {
      console.log(a);
     // moji = a;
      //console.log(a.match(/\[.*?\]/g));
      this.commandhairetsu = a.match(/\[.*?\]/g); 
      this.commandhairetsu2 = a.match(/(?<=\[).*?(?=\])/g); 
      //this.commandhairetsu3 =  a.match(/(?<=\s).*(?=\n)/g); 
      //this.commandhairetsu3 =  a.match(/\<.*\n/g); 
      //console.log(this.commandhairetsu3);
      //this.commandhairetsu3 = a.split(/\n/); 
      this.aaaa = a.split("optional arguments:");
      console.log(this.aaaa[0]);
      console.log(this.aaaa[1]);

      this.bbbb = this.aaaa[1].split(' ');

      //this.commandhairetsu4 = this.aaaa[1].match(/ {2,}.*?\n/g);
      this.commandhairetsu4 = this.aaaa[1].match(/(?<= {2}.*? {2,}).*?\n/g);

    });
    

//0907コマンドライン文字列抽出 完成版
for(let i = 0; i < this.coUsage.length ;i++){
        this.commandLineRensou.usage = this.coUsage[i];
        this.commandLineRensou.arguments = this.coArguments[i];
       // let commandLineHokan = Object.assign(this.commandLineRensou);
        //this.commandLine.push(commandLineHokan);
        //this.commandLine[i] = this.commandLineRensou;
        //console.log(this.commandLine[0]);
        //Object.assign(this.commandLine[i],this.commandLineRensou);
       // var test = {...this.commandLinerensou};
       // console.log(test);
        this.commandLine.push(_.cloneDeep(this.commandLineRensou));

     };
     //console.log(this.commandLine[1].usage);
     //console.log(this.commandLine[2].arguments);
    });



//0923コマンドラインのヘルプ表示をいい感じに格納したい
  this.socket.on('deviceList', (d) => {
      this.deviceList = d;
      //今、0番目の配列、ラズパイNO1のみを考えているのでthis.deviceList[0]
      //jループ、一つのラズパイにj個のデバイスが登録されている
      //iループ、1つのデバイスに対してi個のコマンドが用意されている
      //これを何かしらに格納して、this.deviceList[0].client.deviceListと一緒に表示されるようにしたい
      for(let j =0; j<  this.deviceList[0].client.deviceList.length ;j++){
        this.coSplit[j] = this.deviceList[0].client.deviceList[j].Help.split("optional arguments:");
        this.coUsage[j] = this.coSplit[j][0].match(/(?<=\[).*?(?=\])/g);
        this.coArgument[j] = this.coSplit[j][1].match(/(?<= {2}.* {2,})\S.*?(?=\n)/g);
        
  
         for(let i = 0; i < this.coUsage[j].length ;i++){
          this.commandLineRensou.usage = this.coUsage[j][i];
          this.commandLineRensou.argument = this.coArgument[j][i];
          this.commandLine.push(_.cloneDeep(this.commandLineRensou));
         };
         
      }
      
      this.aaa[0] = this.commandLine;
      
      console.log("deviceList from server");      
    });


    //0924いじってる
    this.socket.on('deviceList', (d) => {
      this.deviceList = d;
      
      for(let j =0; j<  this.deviceList[0].client.deviceList.length ;j++){
        this.coSplit[j] = this.deviceList[0].client.deviceList[j].Help.split("optional arguments:");
        this.coUsage[j] = this.coSplit[j][0].match(/(?<=\[).*?(?=\])/g);
        this.coArgument[j] = this.coSplit[j][1].match(/(?<= {2}.* {2,})\S.*?(?=\n)/g);
        
  
         for(let i = 0; i < this.coUsage[j].length ;i++){
          this.commandLineRensou.usage = this.coUsage[j][i];
          this.commandLineRensou.argument = this.coArgument[j][i];
          this.commandLine.push(_.cloneDeep(this.commandLineRensou));
          this.aaa[i] = this.commandLine;
      
         };
         
      }

//コマンドラインを要素に追加　これはnodejs側でできるようにした
this.deviceList = d;
      
      for(let j =0; j<  this.deviceList[0].client.deviceList.length ;j++){

        this.coSplit[j] = this.deviceList[0].client.deviceList[j].Help.split("optional arguments:");
        this.coUsage[j] = this.coSplit[j][0].match(/(?<=\[).*?(?=\])/g);
        this.coArgument[j] = this.coSplit[j][1].match(/(?<= {2}.* {2,})\S.*?(?=\n)/g);
        
  
         for(let i = 0; i < this.coUsage[j].length ;i++){
          this.deviceList[0].client.deviceList[j].usage = this.coUsage[j][i];

           /*
          this.commandLineRensou.usage = this.coUsage[j][i];
          this.commandLineRensou.argument = this.coArgument[j][i];
          this.commandLine.push(_.cloneDeep(this.commandLineRensou));
          this.aaa[i] = this.commandLine;
          */
      
         };

         this.coSplit[j].splice(0,this.coSplit[j].length);
        this.coUsage[j].splice(0,this.coUsage[j].length);
        this.coArgument[j].splice(0,this.coArgument[j].length);
         
      }

///1005 recipe-action.vue
computed:{

      deviceDataArray: function(){
          //これ、jsが参照渡しだから根源のdeviceDataが書き換わっちゃうんだよね
          if(this.deviceData.length >0){
             var deviceListTemp = [];
                       var aaaa = this.deviceData[0].client.deviceList
                       aaaa.forEach(a =>{
                           a.socket = this.deviceData[0].socket;
                           a.clientData = this.deviceData[0].client.clientData;
                       });
                       deviceListTemp.push(...aaaa);
           return deviceListTemp
          };

       },
       

      deviceDataArray: function(){
          if(this.deviceData.length >0){
              var deviceArrayTemp =[];
              for(let i=0; i < this.deviceData.length; i++){
                deviceArrayTemp.push(...this.deviceData[i].client.deviceList);  
              };
              return deviceArrayTemp
          };
      },
},


  //socketの情報をたそうとしている
      deviceDataArray: function(){
          //これ、jsが参照渡しだから根源のdeviceDataが書き換わっちゃうんだよね
          if(this.deviceData.length >0){
             var deviceListTemp = [];
                       var aaaa = this.deviceData[0].client.deviceList
                       aaaa.forEach(a =>{
                           a.socket = this.deviceData[0].socket;
                       });
                       deviceListTemp.push(...aaaa);
           return deviceListTemp
          };
       },

       
/*
      deviceDataArray: function(){
          if(this.deviceData.length >0){
              var deviceArrayTemp =[];
              for(let i=0; i < this.deviceData.length; i++){
                deviceArrayTemp.push(...this.deviceData[i].client.deviceList);  
              };
              return deviceArrayTemp
          };
          
      },
      */

    

    //1014 recipe-action.vue
  computed
    //複数のclient接続にも対応させる(deviceData[0]の[]をfor文で回したり...?)
      deviceDataArray: function(){
          if(this.deviceData.length >0){
             var deviceListTemp = [];
             console.log('かくにん');
             /* 10/13 なんか動かへんくなってんけど 　for文がだめっぽい？ forEach試してみよう
              for(let i; i<this.deviceData.length; i++){
                    var de = this.deviceData[0].client.deviceList
                    deviceListTemp.push(...de);
                    console.log('かくにん2');
              };
              */
             var de = this.deviceData[0].client.deviceList
                    deviceListTemp.push(...de);
                    console.log('かくにん2');
           return deviceListTemp
          };
       },

    </script>