<template>
  <header class="header">
    <div class="logo">
      <img src="@/assets/logo.png" alt="logo">
      <span>临床专病数据系统</span>
    </div>
    <div class="right-menu">
      <img src="@/assets/m.png" class="menu-icon" />
      <span class="username">{{ username }}</span>
      <img src="@/assets/out.png" class="menu-icon" @click="logout">
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Header',
  setup() {
    const router = useRouter()
    const username = ref('管理员')

    const logout = () => {
      router.push('/')
    }

    return {
      username,
      logout
    }
  }
})
</script>

<style scoped lang="scss">
.menu-icon {
  width: 40px;
  height: 40px;
  margin-right: 8px;
}

.header {
  height: 60px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center; 
  justify-content: space-between;
  padding: 0 20px;

  .logo {
    display: flex;
    align-items: center;
    
    img {
      height: 40px;
      margin-right: 10px;
    }

    span {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
  }

  .right-menu {
    display: flex;
    align-items: center;
    gap: 20px;

    .username {
      color: #666;
    }
  }
}
</style> 