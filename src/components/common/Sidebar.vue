<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      @select="handleSelect"
      :router="true"
    >
      <el-menu-item index="/dashboard/help">
        <img src="@/assets/1.png" class="menu-icon" />
        <span>使用帮助</span>
      </el-menu-item>

      <el-sub-menu index="data">
        <template #title>
          <img src="@/assets/2.png" class="menu-icon" />
          <span>数据维护</span>
        </template>
        <el-menu-item index="/dashboard/system">系统词条</el-menu-item>
        <el-menu-item index="/dashboard/template">数据模板</el-menu-item>
        <el-menu-item index="/dashboard/calculation">计算属性</el-menu-item>
        <el-menu-item index="/dashboard/disease">专病数据</el-menu-item>
      </el-sub-menu>

      <el-menu-item index="/dashboard/chart">
        <img src="@/assets/3.png" class="menu-icon" />
        <span>图表分析</span>
      </el-menu-item>

      <el-menu-item index="/dashboard/visualization">
        <img src="@/assets/4.png" class="menu-icon" />
        <span>结果可视化</span>
      </el-menu-item>
      
    </el-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  QuestionFilled,
  DataLine,
  PieChart,
  TrendCharts
} from '@element-plus/icons-vue'

export default defineComponent({
  name: 'Sidebar',
  components: {
    QuestionFilled,
    DataLine,
    PieChart,
    TrendCharts
  },
  setup() {
    const route = useRoute()
    const activeMenu = ref(route.path)

    const handleSelect = (index: string) => {
      activeMenu.value = index
    }

    return {
      activeMenu,
      handleSelect
    }
  }
})
</script>

<style scoped lang="scss">
.sidebar {
  width: 200px;
  height: 100%;
  background: #fff;
  border-right: 1px solid #e6e6e6;

  .sidebar-menu {
    border-right: none;
    
    :deep(.el-menu-item) {
      &.is-active {
        background-color: #ecf5ff;
      }
    }
  }
}
.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

</style> 