<template>
  <div class="login-container">
    <!-- 顶部留白区域 -->
    <div class="header-space">
      <div class="header-icon">
        <img src="../assets/logo.png" alt="Logo Icon" class="logo-icon" />
      </div>
    </div>
    <div class="login-box">
      <h2>临床专病数据系统</h2>
      <div class="login-form">
        <div class="form-item">
          <label>用户名</label>
          <input type="text" v-model="username" placeholder="请输入用户名">
        </div>
        <div class="form-item">
          <label>密码</label>
          <input type="password" v-model="password" placeholder="请输入密码">
        </div>
        <div class="form-item remember">
          <label class="remember-label">
            <input type="checkbox" v-model="remember">
            <span>记住我</span>
          </label>
          <a href="#" class="forget-pwd">忘记密码?</a>
        </div>
        <button class="login-btn" @click="handleLogin">登录</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import {ElMessage} from "element-plus";
import {loginCreate} from "@/api/login.ts";

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')
    const remember = ref(false)

    const handleLogin = async () => {
      // 模拟登录成功
      // localStorage.setItem('token', 'dummy-token')
      // router.push('/dashboard')
      const res = await loginCreate({
        username:username.value,
        password:password.value
      })
        if(res.data.code == 200 && res.data.data ){
          ElMessage.success('登录成功')
          router.push({
            path: '/dashboard'
          })
        }else {
          ElMessage.error("账号密码错误，请重试")
        }
    }

    return {
      username,
      password,
      remember,
      handleLogin
    }
  }
})
</script>

<style scoped lang="scss">
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column; /* 垂直排列顶部留白和登录框 */
  background: url('../assets/login.jpg') no-repeat center center;
  background-size: cover;
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
}

.header-space {
  width: 100%;
  height: 80px; /* 顶部留白区域高度，可根据需要调整 */
  display: flex;
  align-items: center;
  padding-left: 40px; /* 留出左侧空间 */
  background: rgba(255, 255, 255, 0.8); /* 轻微的白色背景，便于区分 */
  position: absolute; /* 固定在顶部 */
  top: 0;
  left: 0;
}

.header-icon {
  .logo-icon {
    width: auto; /* 调整图标大小 */
    height: 100px;
  }
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-size: 24px;
    font-weight: bold;
  }

  .login-form {
    .form-item {
      margin-bottom: 20px;

      label {
        display: block;
        margin-bottom: 8px;
        color: #7F265B;
        font-size: 14px;
      }

      input[type="text"],
      input[type="password"] {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        outline: none;
        font-size: 14px;
        color: #7F265B;

        &:focus {
          border-color: #7F265B;
        }

        &::placeholder {
          color: #7F265B;
        }
      }
    }

    .remember {

      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;

      .remember-label {

        display: flex;
        align-items: center;
        margin: 0;

        input[type="checkbox"] {
          margin-right: 5px;
        }

        span {
          color: #7F265B;
          font-size: 14px;
        }
      }

      .forget-pwd {
        color: #7F265B;
        text-decoration: none;
        font-size: 14px;

        &:hover {

          text-decoration: underline;
        }
      }
    }

    .login-btn {
      width: 100%;
      padding: 12px;
      background: #7F265B;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;

      &:hover {
        background: #6b1f4d;
      }
    }
  }
}
</style>
