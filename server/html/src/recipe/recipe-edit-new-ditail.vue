<template>
<div>
    <div v-show='selectedAction.Argument == "wait"'>
        <input type='number' placeholder='Time' class='uk-input uk-width-1-4' @input="$emit('update:newDetailTemp', $event.target.value)"> seconds
    </div>
    <div v-show='selectedAction.Argument == "--irate" || selectedAction.Argument == "--wrate"'>
       <input type='number' placeholder='Rate' class='uk-input uk-width-1-4' @input="$emit('update:newDetailTemp', $event.target.value)">
       <select class='uk-select uk-width-1-4' @input="$emit('update:newDetailUnitTemp', $event.target.value)">
           <option disabled :value='""' selected>--Unit--</option>
           <option :value='"m/m"'>mL/min</option>
           <option :value='"m/s"'>mL/s</option>
           <option :value='"u/m"'>μL/min</option>
           <option :value='"u/s"'>μL/s</option>
           <option :value='"n/m"'>nL/min</option>
           <option :value='"n/s"'>nL/s</option>
       </select>
    </div>

</div>
</template>

<script>

export default{
    props:['selectedAction','newDetailTemp','newDetailUnitTemp'],



    data(){
        return{ 

        }
    },

    mounted(){
    },

    methods :{

    },

    watch:{

    },

    computed:{
      
    },
    
}

</script>
<style scoped lang='scss'>

</style>