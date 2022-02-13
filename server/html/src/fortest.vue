<template>
<div class='uk-card uk-card-body uk-card-default'>
 
  <button class="uk-button uk-button-primary uk-width-1-4" @click="measurement()">MEASURE</button>
    <div>測定値 : {{testmeasurementResultValue}}</div>
</div>
</template>

<script>



export default{

    props:['testmeasurementResultValue'],
 
     data(){
        return{

        }
    },

    methods :{
      measurement(){
           this.$emit('testMeasurement');
      }
    },

    computed:{

    },
}
</script>
<style>

</style>