<template>
    <div id="profile" class="edit">
        <v-col>
            <v-row align="end" justify="end" class="avatar-wrapper">
                <h1> Editting Profile: </h1>
                <v-avatar id="avatar" size="50vw" max max-height="300px" > 
                    <v-icon v-if="photoURL == '' || photoURL == null" color="grey" size="112"> mdi-account-circle </v-icon>
                    <img v-else v-bind:src="t(photoURL)">
                </v-avatar>
            </v-row>
            </v-col>
             <v-col align="center" padding="0">
             <v-form 
                class ="form"
                ref="form"
                lazy-validation
                >
                <v-text-field
                    v-model="name"
                    hide-details
                    label="Full Name"
                    v-bind:text="t(name)"
                    v-bind:placeholder="t(name_old)"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="currentPassword"
                    hide-details
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="enabled ? passwordRules : ''"
                    :type="show ? 'text' : 'password'"
                    label="Current Password"
                    v-bind:disabled="enabled ? false : true "
                    @click:append="show = !show"
                ></v-text-field> 

                <v-text-field
                    v-model="email"
                    hide-details
                    :rules="emailRules"
                    label="E-mail"
                    v-bind:text="t(email)"
                    v-bind:placeholder="t(email_old)"
                    v-bind:disabled="currentPassword ? false : true"
                ></v-text-field> 

                <v-text-field
                    v-model="password"
                    hide-details
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="enabled && password ? passwordRules : ''"
                    :type="show ? 'text' : 'password'"
                    label="New Password"
                    v-bind:disabled="currentPassword ? false : true"
                    @click:append="show1 = !show"
                ></v-text-field> 
            

                <v-text-field
                    v-model="confirmPassword"
                    hide-details
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="enabled ? passwordRules && password : ''"
                    :type="show1 ? 'text' : 'password'"
                    label="Confirm New Password"
                    v-bind:disabled="currentPassword && password ? false : true"
                    @click:append="show2 = !show1"
                ></v-text-field>

                <p>Password must have 8+ characters, one uppercase character, one number and one special character.</p>
                <div class="red--text"> {{errorMessage}}</div>

                <v-btn
                class="save_button"

                @click="save">Save</v-btn>
                </v-form>
            </v-col>
    </div>
</template>

<script>
import { getUser, editAccount, getUserInfo, reAuth } from "../server/user";
let user;

    export default {
        data: () => ({
            photoURL: '',
            photoURL_old: '',
            name: '',
            email: '',
            name_old: '',
            email_old: '',
            enabled: true,

            // form
            errorMessage: "",
            currentPassword : '',
            password: '',
            confirmPassword: '',
            show : false,
            show1 : false,
            show2 : false,
            passwordRules: [
                v => (v && v.length >= 8) || 'Password must have 8+ characters',
                v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character', 
                v => /(?=.*\d)/.test(v) || 'Must have one number', 
                v => /([?.!@$%])/.test(v) || 'Must have one special character [?.!@#$%]'
            ],
            emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ]
        }),

        async created() {
            user = getUser();
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
                this.name = this.name_old = userInfo[1];
                this.email = this.email_old = userInfo[2];
            },
            t(value) {
                return value;
            },

            async save() {            
                const valid = await this.$refs.form.validate();
                if(valid.valid) {
                        const name = (this.name != "") ? this.name : this.name_old;
                        const photoURL = (this.photoURL != "") ? this.photoURL : this.photoURL_old;
                        let email, password = false;
                        if (this.currentPassword) {
                            let authed = await reAuth(this.currentPassword);
                            if(!authed )
                                return this.errorMessage = "Incorrect Password";
                            if(this.password != this.confirmPassword)
                                return this.errorMessage = "Passwords do not match";
                            email = (this.email != this.email_old) ? this.email : false;
                            password = (this.password != "") ? this.password : false;
                        }
                        const editted = await editAccount(email, password, name, photoURL);
                        if ( editted )
                            this.$router.push({path: "/profile"});
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #profile {
        &.edit {
            .avatar-wrapper {
                padding: 5% 10%;
                position: relative;

                h1 {
                    position: absolute;
                    top: 20%;
                    left: 11%;
                    font-size : 25px;
                }
            }
            .v-icon{
                position: absolute;
                width : 50%;
            }

            .v-avatar {
                max-height: 100px;
                max-width: 100px;

                img {
                    width: 100%;
                    height: 100%;
                }
            }

            #avatar {
                // width: 30vw;
                // height: 30vw;

                // max-height: 200px;
                // max-width: 200px;

                i:last-of-type::before {
                    text-shadow: 0 0 2px black;
                }
            }
            p{
                font-size : 10px;
                padding : 0% 10%;
            }

            .name {
                padding: 0 5%;

                .v-field__overlay {
                    background-color: unset;
                }
            }

            .red--text {
                color: red;
            }

            .save_button {
                width: 50vw;
                color : white;
                background-color : black;
                border-left: solid thin black;
            }
        }
    
    }
    @media screen and (min-width: 780px) {
       #profile {
           .v-text-field{
                height : 4vw;
        }
        &.edit {
        .avatar-wrapper {
                padding: 2% 5%;
        
        h1{
            font-size : 40px;
            left: 9%;
        }
        }
        
        .v-avatar {
            max-height: 200px;
                max-width: 200px;
                margin-right : 10%;
                img{
                    padding :0;
                    margin: 0;
                    width: 100%;

                    height: 100%;
                }
            }
       } 
       }
    }
</style>
