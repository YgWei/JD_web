<template>
  <div>
    <v-toolbar>
      <img src="@/assets/logo.png" class="logo" @click="returnHome" />
      <v-spacer></v-spacer>
      <v-menu transition="slide-y-transition" bottom>
        <template v-slot:activator="{ on }">
          <v-btn color="white" icon v-on="on">
            <v-icon color="black">mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            @click="logout(item)"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: "User Management", value: "userManage" },
        { title: "Account Settings", value: "setting" },
        { title: "Log Out", value: "logout" }
      ]
    };
  },
  methods: {
    returnHome() {
      this.$router.push("/home").catch(() => {});
    },
    logout(eventClick) {
      if (eventClick.value === "logout") {
        localStorage.removeItem("token");
        this.$gAuth.signOut();
        this.$router.push("/login");
      } else if (eventClick.value === "setting") {
        console.log(eventClick);
      } else {
        console.log(eventClick);
      }
    }
  }
};
</script>

<style scoped>
.logo {
  display: inline-block;
  vertical-align: top;
  height: 40px;
}
</style>
