<template>
    <div id="profile" >
        <v-col align="center">
            <v-row align="center" justify="center" class="avatar-wrapper">
                <v-avatar size="50vw" max max-height="300px" @click="changeAvatar"> 
                    <v-icon v-if="photoURL == '' || photoURL == null" dark size="132"> mdi-account-circle </v-icon>
                    <img v-else v-bind:src="t(photoURL)">
                </v-avatar>
            </v-row>
                <v-text-field
                    hide-details
                    v-bind:label="t(name)"
                    value="John Doe"
                    disabled
                    prepend-icon="mdi-account"
                ></v-text-field>
                <v-text-field
                    hide-details
                    v-bind:label="t(email)"
                    value="Email"
                    disabled
                    prepend-icon="mdi-email"
                ></v-text-field>
                <v-btn @click="edit">Edit Profile</v-btn>
                <p></p>
                <v-btn @click="logOut" class="disconnect">Disconnect</v-btn>
            </v-col>
    </div>
</template>

<script>
    import { getUser, getUserInfo } from "../server/user";
    import { getAuth, signOut } from "firebase/auth";
    const auth = getAuth();


    
    export default {
        name: "Profile",
        
        data: () => ({
            photoURL: '',
            name: '',
            email: ''
        }),
        
        beforeMount() {

        },

        async created() {
            const user = await getUser();
            if (user == null) {
                this.$router.push({path: "/login"});
                return false;
            }
            await this.getInfo();
        },

        methods: {
            async getInfo() {
                let userInfo = await getUserInfo();
                this.photoURL = userInfo[0];
                this.name = userInfo[1];
                this.email = userInfo[2];
            },
            t(value) {
                return value;
            },
            edit(){
                this.$router.push({path: "/profile/edit"});
            },
            logOut(){
                window.localStorage.removeItem("userId");
                signOut(auth);
                // this.$router.push({path: "/login"});
                window.location.href = "/login";
            }
        }
    }
</script>

<style lang="scss" scoped>

    #profile {
        
        .v-text-field{
            margin : 10% 0%;
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
    @media screen and (min-width: 780px) {
                #profile{
                    .v-btn{ 
                        padding : 20px;
                        margin-top : 30px;  }
                    .v-text-field{
                        height : 4vw;
                        width : 85%;
                        margin : 0;
                    }
                }
                
                v.avatar, img{
                    margin-bottom : 50px;
                    padding : 50px;
                }
            }
</style>
