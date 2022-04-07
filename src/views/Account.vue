<template>
    <!-- <v-main>  -->
    <div class="profile">
        <section class="user-info">
            <v-row align="center" justify="center" class="avatar-wrapper">
                <!-- <div  id="avatar" :style="avatar"></div> -->
                <v-avatar color="lightgray" size="50vw" max max-height="300px"> 
                    <v-icon dark> perm_identity </v-icon> 
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/0c/Cow_female_black_white.jpg"> 
                </v-avatar>
            </v-row>
            <v-col align="center">
                <v-text-field
                    label="John Doe"
                    value="John Doe"
                    solo
                    disabled
                    prepend-icon="mdi-account"
                ></v-text-field>
                <v-text-field
                    label="password"
                    v-model="password"
                    :type="show ? 'text' : 'password'"
                    solo
                    disabled
                    prepend-icon="mdi-lock"
                ></v-text-field>
                <v-text-field
                    label="abcde@homtail.com"
                    value="Email"
                    solo
                    disabled
                    prepend-icon="mdi-email"
                ></v-text-field>
                <v-text-field
                    label="+1 111 222 3333"
                    value="Phone Number"
                    solo
                    disabled
                    prepend-icon="mdi-phone"
                ></v-text-field>
                <v-btn @click="edit">Edit Profile</v-btn>
                <p></p>
                <v-btn @click="deleteAcc" class="disconnect">Disconnect</v-btn>
            </v-col>
        </section>
    </div>
    <!-- </v-main> -->
</template>

<script>
import { getUserInfo } from "../server/db.js";
    export default {
        name: "Profile",
        show: false,
        
        computed: {
            avatar () {
                // return "background-image: url('" + this.user.src + "');";
            }
        },

        methods: {
            edit(){
                this.$router.push({path: "/profile/edit"})
            },
            deleteAcc(){
                
            }
        }
    }
</script>

<style lang="scss">
    .profile {
        
        .v-text-field{
            padding : 0;
            margin : 0;
            height : 20vw;
            width : 85%;
        }
        .v-avatar {
            max-height: 300px;
            max-width: 300px;

            img {
                object-fit: cover;
                object-position: center;
                width: 40vw;
                height: 40vw;
                max-width: 300px;
                max-height: 300px;
            }
        } 
            .v-btn {
                color : white;
                background-color : black;
                width : 70%;
                height: 50%;
                padding : 5%;
                
            }
            .disconnect {
                margin-top : 5%;
                color: red;
            }
        
    }
</style>
