<template>
  <div >
      
      <b><p class="top-bar" style="text-align: center;">ORDER STATUS</p></b>
    <br><br><br>

    <div><v-progress-linear
      :model-value="value"
      color="green"
      rounded 
    ></v-progress-linear>
    <br><br><br><br></div>
  

<p  class="lol" :style=" status === 'Received' ? 'color:green' : ''">{{timestamps[0] ? timestamps[0] : '--:--'}}
Your order was received</p>
<br><br>
<p class="lol" :style=" status === 'Preparing' ? 'color:green' : ''">{{timestamps[1] ? timestamps[1] : '--:--'}}
Preparations are under way</p>
<br><br>
<p class="lol" :style=" status === 'Ready to be served' ? 'color:green' : ''">{{timestamps[2] ? timestamps[2] : '--:--'}}
Ready to be served</p>
<br><br>
<p class="lol" :style=" status === 'Serving' ? 'color:green' : ''">{{timestamps[3] ? timestamps[3] : '--:--'}}
Anthony is serving you your order</p>
<br><br>

</div>
</template>

<script>
import { doc, onSnapshot } from "firebase/firestore";
import {db} from '../server/db.js'
  export default {
    props : ['id'],
    data () {
      return {
        value: 25,
        status : 'Received',
        statuses : ['Received', 'Preparing', 'Ready to be served', 'Serving'],
        timestamps : []
      }
    },
    created () {
      const status =  onSnapshot(
      doc(db, "orders", this.id), 
      { includeMetadataChanges: true }, 
      (doc) => {
        let currentTime = new Date();
        this.timestamps.push(`${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`)
        this.status = doc.data().status;
        this.value = 25 * (this.statuses.indexOf(this.status)+1)
      })
    }
  }
</script>
<style>
.top-bar {
  color: white;
  text-align: center;
  background-color: black;
  display: flex;
}
.lol{
    margin-left: 20px;
}
</style>