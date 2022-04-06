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
        label="Email or phone number"
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
    
    <p>New here ? Please sign up just here </p>
    
     <p><a
        href="create"
        class="text-decoration-none"
        
      >Create account</a></p>
  </div>
</template>

<script>
export default {
data: () => ({
    isValid: true,
    login: '',
    password:' ',
    show: false,
    loginRules: [
      v => !!v || 'Name is required',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 8) || 'Password must have 8+ characters',
      v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character', 
    v => /(?=.*\d)/.test(v) || 'Must have one number', 
    v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
    ],
  }),

  methods: {
    validate () {
      this.$refs.form.validate()
    },
    create (){
        
    }
  },
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
