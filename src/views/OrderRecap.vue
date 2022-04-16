<template>
    <div v-if="!landscape" class="top-bar">
        <v-icon @click="Back" style="margin-right: 20px"
        >mdi-arrow-left-thick</v-icon
        ><h3>Order Recap</h3>
    </div>
    <v-sheet style="padding : 10px; margin : 10px" elevation="1">
        <v-row>
            <v-col cols="2">
                <span>Qty</span>
            </v-col>
            <v-col cols="6">
                <span>Item</span>
            </v-col>
            <v-col class="d-flex justify-end">
                <span>Price</span>
            </v-col>
        </v-row>
        <v-divider />
        <v-row v-for="item in orderDetail" :key="item.id">
            <v-col cols="2">
                <span>x{{item.quantity}}</span>
            </v-col>
            <v-col cols="6">
                <span>{{item.name}}</span>
            </v-col>
            <v-col class="d-flex justify-end">
                <span>{{item.price}}$</span>
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col>
                <span>Subtotal</span>
            </v-col>
            <v-spacer />
            <v-col class="d-flex justify-end">
                <span>{{subtotal}}$</span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="7">
                <span>Tax</span>
            </v-col>
            <v-col class="d-flex justify-end">
                <span>{{tax}}$</span>
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col>
                <span>Total</span>
            </v-col>
            <v-col class="d-flex justify-end">
                <span>{{total}}$</span>
            </v-col>
        </v-row>
    </v-sheet>
     <v-btn v-if="!fromOrders" @click="placeOrder" class="descbutton">Place Order</v-btn>
</template>

<script>
import {addOrder} from '../server/db.js'
export default {
    name : 'OrderRecap',
    props: {
        order: {
            type : String,
            default: '',
        },
        resto : {
            type : String,
            default: '',
        },
        fromOrders : {
            type : Boolean,
            default: false,
        },
        isLandscape : {
            type : String,
            default: false,
        }
    },
    data: () => ({
        subtotal: 0,
        tax : 0,
        total : 0,
        orderDetail : [],
        restaurantInfo : {},
        landscape : false
    }),
    watch : {
        order (value) {
            this.orderDetail = JSON.parse(value)
            this.calculateSubtotal()
        },
        isLandscape (value) {
            this.landscape = JSON.parse(value)
        },
        resto (value) {
            this.restaurantInfo = JSON.parse(value)
        }
    },
    methods: {
        calculateSubtotal () {
            this.subtotal = 0;
            this.orderDetail.map(item => this.subtotal += item.price * item.quantity);
            this.calculateTax()
        },
        calculateTax () {
            this.tax = parseFloat((this.subtotal * 0.15).toFixed(1))
            this.total = (this.tax + this.subtotal).toFixed(1)
        },
        async placeOrder (){
            let order = {
                date: new Date(),
                total : this.total,
                user : window.localStorage.getItem('userId'),
                restaurantName : this.restaurantInfo.title,
                img :  this.restaurantInfo.img,
                status : 'Received',
                id : this.restaurantInfo.id,
                description : this.getDescription(),
                lineItems : this.orderDetail,
                token : window.localStorage.getItem('Message_Token')
            }
            const id = await addOrder(order);
            order.id = id;
            window.localStorage.setItem('order',JSON.stringify(order))
            this.$router.push({ name: "status", params: { id: id, restaurantName : this.restaurantInfo.title } })
        },
        getDescription () {
            let description = '';
            this.orderDetail.map((item, index) => {
                if(index < this.orderDetail.length - 1)
                    description += item.name + ', '
                else
                    description += item.name
            })
            return description;
        },
        Back() {
            if(!this.fromOrders)
                this.$router.push({name: "menu", params : { id: this.restaurantInfo.id, orderRecapItems : JSON.stringify(this.orderDetail)}})
            this.$router.push({ name :'orders'})
        }   
    },
    created () {
        if(this.order.length > 0){
            this.orderDetail = JSON.parse(this.order)
            if(!this.fromOrders)
                this.restaurantInfo = JSON.parse(this.resto)
            this.calculateSubtotal()
            
        }
        this.landscape = this.isLandscape

    }
}
</script>

<style scoped>
.v-row {
    padding : 10px
}
span {
    font-weight: bold;
}
</style>