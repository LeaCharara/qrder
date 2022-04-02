<template>
  <div>
    <h1> Sign in </h1>
    <v-form 
      v-model="isValid"
      ref="form"
      lazy-validation
    >
      <v-text-field
        v-model="username"
        :rules="usernameRules"
        label="Username"
        required
      ></v-text-field>
  
      <v-text-field
        v-model="password"
        :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
        :rules="passwordRules"
        :type="show ? 'text' : 'password'"
        label="Password"
        required
        @click:append="show = !show"
      ></v-text-field>  
      
      <v-btn
        :disabled="!isValid"
        color="success"
        class="mr-4"
        @click="validate"
      >
        Confirm
      </v-btn>
    </v-form>
    
    You don't have a account ? 
    
     <v-btn
        :disabled="!isValid"
        color="success"
        class="mr-4"
        @click="create"
      >
        Create account
      </v-btn>
  </div>
</template>

<script>
export default {
data: () => ({
    isValid: true,
    username: '',
    password:' ',
    show: false,
    usernameRules: [
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
