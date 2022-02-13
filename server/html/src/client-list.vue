<template>
<div class="uk-card uk-card-body uk-card-default">

  <ul class='uk-list uk-list-hyphen'>
  <li v-for="(item,index) in deviceData" :key='index'> 
    {{item.client.clientData.name}}
    <ul uk-accordion>
      <li v-for="item2 in item.client.deviceList" :key='item2.id'> 
        <a class='uk-accordion-title' href='#'>
          {{item2.Device}}({{item2.Model}}, {{item2.Company}})
        </a>
        <div class='uk-accordion-content'>
          <table class='uk-table uk-table-hover'>
            <thead>
              <tr>
                <th>option</th>
                <th>detail</th>
                <th></th>
                <th>result</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for='(value,index2) in item2.HelpUsage' :key='index2'>
                <td>{{value}}</td>
                <td>{{item2.HelpArgument[index2]}}</td>
                <td> <button class="uk-button uk-button-default uk-button-small" type="button" 
                @click='clientAction(item2,value,item2.HelpArgument[index2])'>Run</button></td>
                <td>{{item2.aaaa}}</td>
              </tr>
            </tbody>
          </table>

        </div>
      </li>
    </ul>

  </li>
  </ul>

  
</div>
</template>

<script>
export default {
  props: ['deviceData','clientActionResultValue'],

  data(){
    return{
      clientActionObj:null,
      
    }
  },

  methods: {
    clientAction(deviceInfo,helpUsage,helpArgument){
      this.clientActionObj = JSON.parse(JSON.stringify(deviceInfo));
      this.clientActionObj.HelpUsage = helpUsage;
      this.clientActionObj.HelpArgument = helpArgument;
      this.$emit('clientAction',this.clientActionObj);

    },
  },

  watch:{
    clientActionResultValue:{
      handler: function(val,oldval){
      console.log(oldval);
      console.log(val);
      },
      immediate:true,
      deep:true,
    }
  }
}
</script>
