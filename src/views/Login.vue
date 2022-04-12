<template>
  <div>
    <h1> Welcome back ! </h1>
    <v-form 
      class = "form"
      v-model="isValid"
      ref="form"
      lazy-validation
    >

    Login
      <v-text-field
        class="field"
        v-model="login"
        :rules="loginRules"
        label="Email"
        required
      ></v-text-field>
  
    Password
      <v-text-field
        v-model="password"
        class="field"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRules"
        :type="show ? 'text' : 'password'"
        label="Password"
        required
        @click:append="show = !show"
      ></v-text-field>  
      
      <v-btn
        :disabled="!isValid"
        class="signin-btn"
        @click="validate"
      >
        Sign in
      </v-btn>
    </v-form>
    
    <section id="firebaseui-auth-container"></section>

    <p>New here? Please sign up just here </p>
    
     <p><a
        href="create"
        class="text-decoration-none"
        
      >Create account</a></p>
  </div>
</template>

<script>
import firebase from "firebase/compat/app";
import * as firebaseui from 'firebaseui';
import { config } from "../server/db.js";

// import { login } from "../server/db.js";

import "firebaseui/dist/firebaseui.css";

firebase.initializeApp(config);

import { SignIn } from "../server/db.js";

export default {
data: () => ({
    isValid: true,
    login: '',
    password:' ',
    show: false,
    loginRules: [
      v => !!v || 'Mail is required',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
    //   v => (v && v.length >= 8) || 'Password must have 8+ characters',
    //   v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character', 
    // v => /(?=.*\d)/.test(v) || 'Must have one number', 
    // v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
    ],
  }),

  methods: {
    async validate () {
      const valid = await this.$refs.form.validate();

      if(valid.valid) {
        const user = await SignIn(this.login, this.password);
        if (user) {
          window.localStorage.setItem("userId", user.uid);
          this.$router.push({path: "/profile"});
        }  
      }
    },
    create (){
        
    }
  },

  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
        ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    var uiConfig = {
        callbacks: {
          signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            var user = authResult.user;
            // window.localStorage.setItem("token", user.accessToken);
            window.localStorage.setItem("userId", user.uid);
            return true;
          }
        },
        signInSuccessUrl: "/profile", // This redirect can be achived by route using callback.
        signInFlow: "popup",
        signInOptions: [
                      // firebase.auth.EmailAuthProvider.PROVIDER_ID,
                      {
                        provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                        customParameters: {
                          // Forces account selection even when one account
                          // is available.
                          prompt: 'select_account'
                        }
                      }
        ]
    };
    // if (ui.isPendingRedirect()) {
      ui.start("#firebaseui-auth-container", uiConfig);
    // }
  }

}
</script>

<style lang="scss" scoped>
h1{
  text-align : center;
  padding : 10%;
}
.signin-btn{
  color : white;
  background-color : black;
  margin-left: 65%;
}
.form{
padding : 10%;
}

.field{
  margin-top : 2%;
  }

a, p {
  text-align: center;
}

</style>
