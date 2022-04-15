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
import { getUser, SignIn, ui, uiConfig } from "../server/user";

import "firebaseui/dist/firebaseui.css";

export default {
  props : {
    fromOrders : {
      type : Boolean,
      default : false
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
  }),

  methods: {
    async validate () {
      const valid = await this.$refs.form.validate();

      if(valid.valid) {
        const user = await SignIn(this.login, this.password);
        if (user) {
          window.localStorage.setItem("userId", user.uid);
          if(this.fromOrders)
            this.$router.push({ name: "Orders"});
          else
            this.$router.push({path: "/profile"});
        }  
      }
    }
  },

  mounted() {
      ui.start("#firebaseui-auth-container", uiConfig);
  },

  async created() {
    console.log(this.fromOrders)
    let user = await getUser();
    if (user != null) 
        this.$router.push({path: "/profile"});
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
