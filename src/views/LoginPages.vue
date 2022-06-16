<template>
  <div class="bg">
    <!-- <div class="login">
      <h2 class="enter">登录</h2>
      <el-form :model="form" class="send" label-width="150px" :rules="rules">
        <el-form-item label="用户名" prop="name">
          <el-input autofocus v-model="form.name" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" show-password />
        </el-form-item>
      </el-form>
      <el-button
        :disabled="disable"
        @click="login"
        class="btn"
        type="primary"
        plain
        >登录</el-button
      >
    </div> -->
    <el-form class="form-login" :model="form" label-width="auto" :rules="rules">
      <el-form-item>
        <h1 class="admin">面壁计划</h1>
      </el-form-item>
      <el-form-item label="用户名" prop="name">
        <el-input autofocus v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="disable" @click="login" type="primary" plain
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { getUsers } from "../api/user";
export default {
  data() {
    return {
      form: {
        name: "",
        password: null,
        // disable: true,
      },
      rules: {
        name: [
          { required: true, message: "用户名不可为空", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "Length should be 3 to 10",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不可为空", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "Length should be 6 to 15",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    disable() {
      return !(this.form.name && this.form.password);
    },
  },
  methods: {
    login() {
      // getUsers();
      this.$router.push({ path: "/users" });
    },
  },
};
</script>

<style scoped>
.bg {
  background-image: url("../public/bg.jpg");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.send {
  width: 400px;
}

.enter {
  position: absolute;
  top: -70px;
  right: 200px;
}

.btn {
  position: absolute;
  top: 105px;
  right: 190px;
}

.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(-50% + -10px), calc(-50% + -10px));
}

.admin {
  margin: 0;
}

.form-login {
  width: 260px;
}
</style>
