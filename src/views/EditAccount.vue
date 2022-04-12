<template>
    <!-- <v-main>  -->
    <div id="profile" class="edit">
        <section class="user-info">
            <v-row align="end" justify="end" class="avatar-wrapper">
                <h1> Editting Profile: </h1>
                <v-avatar size="50vw" max max-height="300px" @click="changeAvatar"> 
                    <v-icon v-if="photoURL == ''" dark size="112"> mdi-account-circle </v-icon>
                    <img v-else v-bind:src="t(photoURL)">
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
                    v-model="name"
                    :rules="nameRules"
                    label="Full Name"
                    v-bind:text="t(name)"
                    v-bind:placeholder="t(name_old)"
                    required
                ></v-text-field>

                <v-text-field
                    v-model="currentPassword"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="enable ? passwordRules : ''"
                    :type="show ? 'text' : 'password'"
                    label="Current Password (To change the info below)"
                    v-bind:disabled="enabled ? false : true "
                    @click:append="show = !show"
                ></v-text-field> 

                <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="E-mail"
                    v-bind:text="t(email)"
                    v-bind:placeholder="t(email_old)"
                    v-bind:disabled="currentPassword ? false : true"
                ></v-text-field> 

                <v-text-field
                    v-model="password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="enable ? passwordRules : ''"
                    :type="show ? 'text' : 'password'"
                    label="Password"
                    v-bind:disabled="currentPassword ? false : true"
                    @click:append="show = !show"
                ></v-text-field> 

                <v-text-field
                    v-model="confirmPassword"
                    :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="enable ? passwordRules : ''"
                    :type="show1 ? 'text' : 'password'"
                    label="Confirm Password"
                    v-bind:disabled="currentPassword ? false : true"
                    @click:append="show1 = !show1"
                ></v-text-field>

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

            currentPassword : '',
            show : false,
            show1 : false,
            show2 : false,
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
            changeAvatar(){
                console.log("hello")
            },
            t(value) {
                return value;
            },

            async save() {
                if(this.password != this.confirmPassword)
                    return this.errorMessage = "Passwords did not match";
                
                const valid = await this.$refs.form.validate();
                if(valid.valid) {
                        const name = (this.name != "") ? this.name : this.name_old;
                        const photoURL = (this.photoURL != "") ? this.photoURL : this.photoURL_old;
                        let email, password = false;
                        if (this.currentPassword) {
                            let authed = await reAuth(this.currentPassword);
                            if(!authed )
                                return this.errorMessage = "Incorrect Password";
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
