<template>
  <div>
    <h1> Welcome back ! </h1>
    <v-form 
      class = "form"
      v-model="isValid"
      ref="form"
      lazy-validation
      align="center"
    >

 
      <v-text-field
        class="field"
        v-model="login"
        :rules="loginRules"
        label="Email"
        required
      ></v-text-field>
  
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
        @click="signUp"
        class="text-decoration-none"
        
      >Create account</a></p>
  </div>
</template>

<script>
import { getUser, SignIn, ui, uiConfig } from "../server/user";

import "firebaseui/dist/firebaseui.css";

export default {
  props : {
    fromOrders : {
      type : String,
      default : 'false'
    }
  },
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
    ],
    fromPageOrders : false,
  }),

  methods: {
    async validate () {
      const valid = await this.$refs.form.validate();

      if(valid.valid) {
        const user = await SignIn(this.login, this.password);
        if (user) {
          window.localStorage.setItem("userId", user.uid);
          if(this.fromPageOrders)
            this.$router.push({ name: "orders"});
          else
            this.$router.push({name: "Profile"});
        }  
      }
    },
    signUp(){
      this.$router.push({name: "create", params: {fromOrders: this.fromPageOrders.toString()}})
    }
  },

  mounted() {
      ui.start("#firebaseui-auth-container", uiConfig);
  },

  async created() {
    this.fromPageOrders = this.fromOrders === 'true'
    let user = await getUser();
    if (user != null) 
        this.$router.push({name: "Profile"});
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
 @media screen and (min-width: 780px) {
   h1{
    padding : 5%;
  }
  .form{
  padding : 0% 5%;
  }
  .signin-btn{
  padding : 2%;
  }
img.firebaseui-idp-icon {
    margin-bottom: 0px;
    padding: 0px;
    }
  }

</style>
