<template>
    <!-- <v-main>  -->
    <div id="profile" class="edit">
        <section class="user-info">
            <v-row align="end" justify="end" class="avatar-wrapper">
                <h1> Editting Profile: </h1>
                <!-- <div  id="avatar" :style="avatar"></div> -->
                <v-avatar color="lightgray" size="50vw" max max-height="300px" @click="changeAvatar"> 
                    <!-- <v-icon dark> perm_identity </v-icon>  -->
                    <img v-bind:src="$t(photoURL)">
                </v-avatar>
            </v-row>
             <v-col align="center">
             <v-form 
                class ="form"
                v-model="isValid"
                ref="form"
                lazy-validation
                >
                <v-text-field
                    v-model="Name"
                    :rules="nameRules"
                    label="Full Name"
                    v-bind:text="$t(name)"
                    v-bind:placeholder="$t(name)"
                    required
                ></v-text-field>
                <v-text-field
                    v-model="password"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="show ? 'text' : 'password'"
                    label="Password"
                    v-bind:disabled=$b(enable)
                    @click:append="show = !show"
                ></v-text-field> 

                <v-text-field
                    v-model="confirmPassword"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="show1 ? 'text' : 'password'"
                    label="Confirm Password"
                    v-bind:disabled=$b(enable)
                    @click:append="show1 = !show1"
                ></v-text-field>
                <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    v-bind:text="$t(email)"
                    v-bind:placeholder="$t(email)"
                    v-bind:disabled=$b(enable)
                ></v-text-field> 

                <!-- <v-text-field
                    v-model="phone"
                    :rules="phoneRules"
                    label="Phone number"
                    required
                ></v-text-field>  -->

                <v-btn
                class="save_button"

                @click="save">Save</v-btn>
                </v-form>
            </v-col>
        </section>
    </div>
    <!-- </v-main> -->
</template>

<script>
import { getUserInfo } from "../server/user";
import { getAuth } from "firebase/auth";
const auth = getAuth();
const user = auth.currentUser;

    export default {
        name: "Profile",
        show : false,
        show1 : false,
        nameRules: [
        v => !!v || 'Name is required',
        ],
        passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 8) || 'Password must have 8+ characters',
        v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character', 
        v => /(?=.*\d)/.test(v) || 'Must have one number', 
        v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
        ],
        emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        phoneRules:[
        v => !!v && !isNaN(parseFloat(v)) || 'Phone is required',
        v => ( v.length = 10) || 'Phone number must have 10 digits',
        ],

        data: () => ({
            photoURL: '',
            name: '',
            email: '',
            enabled: true
        }),

        async created() {
            user.providerData.forEach((profile) => {
                if(profile.providerId == "google.com")
                    this.enabled = false;
            });

             await this.getInfo();

        },

        methods: {
            async getInfo() {
                let userInfo = await getUserInfo();
                this.photoURL = userInfo[0];
                this.name = userInfo[1];
                this.email = userInfo[2];
            },
            changeAvatar(){
                console.log("hello")
            },
            $t(value) {
                return value;
            },
            $b(enable) {
                if (!this.enabled) {
                    return true;
                }
                return false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    #profile {
        &.edit {
            .avatar-wrapper {
                padding: 10% 15%;

                position: relative;

                h1 {
                    position: absolute;
                    top: 20%;
                    left: 5%;
                }
            }

            .v-avatar {
                max-height: 100px;
                max-width: 100px;

                img {
                    filter: blur(2px);
                    -webkit-filter: blur(2px);

                    // width: 30vw;
                    // height: 30vw;

                    // max-height: 200px;
                    // max-width: 200px;

                    width: 100%;
                    height: 100%;
                }
            }

            #avatar {
                width: 30vw;
                height: 30vw;

                max-height: 200px;
                max-width: 200px;
            }

            .name {
                padding: 0 5%;

                .v-field__overlay {
                    background-color: unset;
                }
            }
        }

        .save_button {
                    width: 50vw;
                    color : white;
                    background-color : black;
                    border-left: solid thin black;
                }
    
        }
</style>
