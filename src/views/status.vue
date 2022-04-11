<template>
  <div>
      <br><br>
      <b><center style="text-decoration-line: underline;">ORDER STATUS</center></b>
    <br><br><br>
    

    
    
    <div><v-progress-linear
      v-model="value"
      :buffer-value="bufferValue"
      color="green"
      rounded 
    ></v-progress-linear>
    <br><br><br><br></div>
  

<p style="color:green">9:04
Your order was received</p>
<br><br>
<p>--:--
Preparations are under way</p>
<br><br>
<p>--:--
Final touches to perfection</p>
<br><br>
<p>--:--
Anthony is serving you your order</p>
<br><br>

</div>
</template>

<script>
  export default {
    data () {
      return {
        value: 10,
        bufferValue: 20,
        interval: 0,
      }
    },

    watch: {
      value (val) {
        if (val < 100) return

        this.value = 0
        this.bufferValue = 10
        this.startBuffer()
      },
    },

    mounted () {
      this.startBuffer()
    },

    beforeUnmount () {
      clearInterval(this.interval)
    },

    methods: {
      startBuffer () {
        clearInterval(this.interval)

        this.interval = setInterval(() => {
          this.value += Math.random() * (15 - 5) + 5
          this.bufferValue += Math.random() * (15 - 5) + 6
        }, 2000)
      },
    },
  }
</script>
<style>
p{
    margin-left: 20px;
}
</style>