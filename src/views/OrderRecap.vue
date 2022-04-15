<template>
    <div class="top-bar">
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
     <v-btn @click="placeOrder" class="descbutton">Place Order</v-btn>
</template>

<script>
import {addOrder} from '../server/db.js'
export default {
    props: {
        order: {
            type : String,
            default: '',
        },
        resto : {
            type : String,
            default: '',
        }
    },
    data: () => ({
        subtotal: 0,
        tax : 0,
        total : 0,
        orderDetail : [],
        restaurantInfo : {}
    }),
    methods: {
        calculateSubtotal () {
            this.orderDetail.map(item => this.subtotal += item.price);
            this.calculateTax()
        },
        calculateTax () {
            this.tax = parseFloat((this.subtotal * 0.15).toFixed(1))
            this.total = (this.tax + this.subtotal).toFixed(1)
        },
        async placeOrder (){
            const order = {
                total : this.total,
                user : window.localStorage.getItem('userId'),
                ...this.restaurantInfo,
                description : this.getDescription(),
                lineItems : this.orderDetail,
                token : window.localStorage.getItem('Message_Token')
            }
            const id = await addOrder(order);
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
            this.$router.push({name: "menu", params : { id: this.restaurantInfo.id, orderRecapItems : JSON.stringify(this.orderDetail)}})
        }   
    },
    created () {
        this.orderDetail = JSON.parse(this.order)
        this.restaurantInfo = JSON.parse(this.resto)
        this.calculateSubtotal()
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