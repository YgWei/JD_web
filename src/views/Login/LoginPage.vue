<template>
  <v-container fluid>
    <div>
      <v-btn
        depressed
        color="success"
        rounded
        @click="gitlabLogin"
        :disabled="!isInit"
      >
        <h3 style="color: black">Google</h3>
      </v-btn>
    </div>
  </v-container>
</template>
<script>
import { login } from "@/api";
export default {
  data() {
    return {
      loginText: "",
      isInit: false,
      isSignIn: false
    };
  },
  methods: {
    async gitlabLogin() {
      // if (!this.$route.query.code) {
      const authCode = await this.$gAuth.getAuthCode();
      console.log(authCode);
      const loginResult = await login.googleLogin({
        code: authCode,
        mode: "dev"
      });
      localStorage.setItem("token", loginResult.data.data.jwt);
      this.$router.push("/projects");
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
.container {
  height: 100%;
}
div {
  display: flex;
  justify-content: center;
  align-self: center;
}
</style>
