<template>
  <v-container px-5>
    <h2>User Management</h2>
    <div class="filterContent">
      <v-row no-gutters>
        <v-col>
          <v-select
            hide-details
            outlined
            dense
            :items="filterItems"
            v-model="filterSelected"
            @change="filterChange"
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-btn rounded color="primary" dark @click="goTo()">Invite</v-btn>
      </v-row>
    </div>
    <div id="card">
      <v-data-table
        fixed-header
        :headers="headers"
        :items="users"
        :items-per-page="10"
        height="46vh"
        class="elevation-1"
        item-key="email"
        no-data-text="There are no Members with this status in the current project"
        @click:row="handleClick($event)"
      ></v-data-table>
    </div>
  </v-container>
</template>

<script>
import { user } from "@/api";
export default {
  data() {
    return {
      filterSelected: "All",
      filterItems: ["All", "Active", "Inactive"],
      users: [],
      headers: [
        {
          text: "Member Name",
          align: "start",
          value: "first_name"
        },
        {
          text: "Email",
          value: "email"
        }
      ]
    };
  },
  methods: {
    async filterChange(e) {
      console.log(e);
      try {
        const getUsers = await user.getUser({ status: e });
        console.log(getUsers);
        this.users = getUsers.data.data;
      } catch {
        /* err */
      }
    },
    async handleClick(user) {
      this.$router.push({
        path: "/users/details",
        query: {
          userDetail: user
        }
      });
      console.log(user);
    },
    goTo() {
      this.$router.push("/users/invite");
    }
  },
  async mounted() {
    try {
      const getUsers = await user.getUser({ status: "All" });
      this.users = getUsers.data.data;
    } catch {
      /* err */
    }
  }
};
</script>

<style scoped>
h2 {
  padding-top: 20px;
  padding-bottom: 20px;
  color: black;
  font-weight: normal;
  text-align: center;
}
#card {
  min-height: 150px;
  max-width: 720px;
  margin: 0 auto;
  padding: 25px;
  border: 1px solid rgba(84, 194, 240, 1);
  justify-content: left;
  font-size: 22px;
  border-radius: 3px;
  font-weight: normal;
  /* z-index: 0; */
}
.filterContent {
  max-width: 720px;
  margin: 0 auto;
}
.v-select {
  width: 125px;
}
.v-row {
  justify-content: space-between;
}
</style>
