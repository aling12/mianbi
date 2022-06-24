<template>
  <div class="bg">
    <el-form ref="form" class="form-login" :model="user" label-width="auto" :rules="rules">
      <el-form-item>
        <h1 class="admin">面壁计划</h1>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input autofocus v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="user.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="disable" @click="login" type="primary" plain>登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '../../src/api/user'
import { ElMessage } from "element-plus";
import 'element-plus/es/components/message/style/css'

export default {
  data() {
    return {
      user: {
        username: "",
        password: '',
      },
      rules: {
        username: [
          { required: true, message: "用户名不可为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不可为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    disable() {
      return !(this.user.username && this.user.password);
    },
  },
  methods: {
    login() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          login(this.user)
            .then(res => {
              const { token } = res.data
              localStorage.setItem('token', token)
              this.$router.replace('/users')
            })
            .catch(err => {
              ElMessage.error(err.response.data.message)
            })
        }
      })
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
