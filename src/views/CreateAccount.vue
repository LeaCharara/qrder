<template>
  <div>
    <h1>Create Account </h1>
    <v-form 
      class ="form"
      v-model="isValid"
      ref="form"
      lazy-validation
    >
      <v-text-field
        v-model="name"
        class="field"
        :rules="nameRules"
        label="Full Name"
        required
      ></v-text-field>
  
      <v-text-field
        v-model="email"
        class="field"
        :rules="emailRules"
        label="E-mail"
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

      <v-text-field
        v-model="confirmPassword"
        class="field"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRules"
        :type="show1 ? 'text' : 'password'"
        label="Confirm Password"
        required
        @click:append="show1 = !show1"
      ></v-text-field>
      <p>Password must have 8+ characters, one uppercase character, one number and one special character.</p>

      <!-- <v-text-field
        v-model="phone"
        class="field"
        :rules="phoneRules"
        label="Phone number"
        required
      ></v-text-field>  -->

      <div class="red--text"> {{errorMessage}}</div>

      <v-btn
        :disabled="!isValid"
        class="create-btn"
        @click="validate"
      >
        Confirm
      </v-btn>
    </v-form>
    
    
  </div>
</template>

<script>
import { CreateAccount } from "../server/user";

export default {
data: () => ({
    isValid: true,
    name: '',
    email:'',
    password:'',
    confirmPassword:'',
    // phone:'',
    errorMessage: "",
    show: false,
    show1: false,
    nameRules: [
      v => !!v || 'Name is required',
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 8) || 'Password must have 8+ characters',
      v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character', 
      v => /(?=.*\d)/.test(v) || 'Must have one number', 
      v => /([.?!@$%])/.test(v) || 'Must have one special character [!@#$%]'
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    phoneRules:[
      v => !!v && !isNaN(parseFloat(v)) || 'Phone is required',
      v => ( v.length = 10) || 'Phone number must have 10 digits',
    ]
  }),

  methods: {
    async validate () {
        if(this.password != this.confirmPassword)
            return this.errorMessage = "Passwords did not match";
        
        const valid = await this.$refs.form.validate();
        if(valid.valid) {
          const user = await CreateAccount(this.email, this.password, this.name);
          if (user) {
            window.localStorage.setItem("userId", user.uid);
            this.$router.push({path: "/profile"});
          }  
        }
    },
  },
}

</script>
<style lang="scss" scoped>
h1{
  text-align : center;
  padding : 5%;
}
.form{
padding : 5%;
} 
.v-input__details{
  margin-bottom : 0;
}
p{
font-size : 10px;
padding : 0% 10%;
text-align : center;
}
.create-btn{
  color : white;
  background-color : black;
  margin-left: 65%;
  margin-bottom : 10%;
  margin-top : 10%;
}

</style>
