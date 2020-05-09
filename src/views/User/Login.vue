<template>
  <div>
    {{ isSignIn }}
    <div class="div">
      <h1>Login</h1>
      <div class="loginDiv">
        <p>Account</p>
        <v-text-field dense v-model="account"></v-text-field>
      </div>
      <div class="loginDiv">
        <p>Password</p>
        <v-text-field
          dense
          v-model="password"
          :type="'password'"
        ></v-text-field>
      </div>
      <v-btn depressed rounded color="#4A90E2" @click="login">
        <h3 style="color:white">Login</h3>
      </v-btn>

      <v-btn
        depressed
        color="#E6F3FF"
        rounded
        @click="gitlabLogin"
        :disabled="!isInit"
      >
        <h3 style="color: #8e8e93">Google</h3>
      </v-btn>
    </div>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
import { login } from "@/api";
export default {
  data() {
    return {
      overlay: false,
      account: "",
      password: "",
      loginText: "",
      color: "",
      isInit: false,
      isSignIn: false
    };
  },
  computed: {
    // ...mapGetters({ roles: "getRoles" })
  },
  methods: {
    async login() {
      // await this.Login({
      //   account: this.account,
      //   password: this.password
      // })
      //   .then(res => {
      //     localStorage.setItem("token", res.data.data.jwt);
      //     this.$router.push("/deploymentmanage");
      //   })
      //   .catch(res => {
      //     console.log(res);
      //   });
    },
    async gitlabLogin() {
      // if (!this.$route.query.code) {
      const authCode = await this.$gAuth.getAuthCode();
      console.log(authCode);
      const loginResult = await login.googleLogin({
        code: authCode,
        mode: "dev"
      });
      localStorage.setItem("token", loginResult.data.data.jwt);
      this.$router.push("/home");
      // }
      // else {
      //   try {
      //     const loginResult = await login.googleLogin({
      //       code: this.$route.query.code
      //     });
      //     console.log(loginResult);
      //     localStorage.setItem("token", loginResult.data.data.jwt);
      //     this.$router.push("/deploymentmanage");
      //   } catch {
      //     this.overlay = false;
      //   }
      // }
    }
  },
  async mounted() {
    let that = this;
    let checkGauthLoad = setInterval(function() {
      that.isInit = that.$gAuth.isInit;
      that.isSignIn = that.$gAuth.isAuthorized;
      if (that.isInit) clearInterval(checkGauthLoad);
    }, 1000);
    // console.log(this.$route);
    // if (this.$route.query.code) {
    //   this.overlay = true;
    //   await this.gitlabLogin();
    // }
    // if (localStorage.token) {
    //   await this.userInfo();
    // }
  }
};
</script>
<style scoped>
.theme--light.v-text-field {
  border-color: #4a90e2 !important;
}
.img {
  max-width: 100%;
  height: 100%;
  position: fixed;
}
.div {
  color: grey;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 20%;
  right: 20%;
}
h1 {
  text-align: center;
  font-size: 40px;
  padding-bottom: 30px;
  font-weight: 500;
}
.loginDiv {
  width: 300px;
  align-self: center;
}
p {
  margin: 0px 0px;
  font-size: 12px;
  color: #4a90e2;
}
button {
  width: 300px;
  align-self: center;
  margin-bottom: 10px;
}
.btnImage {
  height: 25px;
  width: 25px;
  position: absolute;
  left: 30px;
}
h3 {
  text-transform: lowercase;
  font-weight: 400;
}
.snackbarBtn {
  margin: 0px;
}
@media screen and (min-width: 1300px) {
  .div {
    color: grey;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 30%;
    right: 30%;
  }
}
</style>
