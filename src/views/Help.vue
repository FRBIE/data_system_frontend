<template>
  <div class="help-container">
    <el-card class="help-section" v-for="(section, index) in helpSections" :key="index">
      <template #header>
        <div class="section-header">
          <el-icon><Document /></el-icon>
          <span>{{ section.title }}</span>
        </div>
      </template>
      <div class="section-content">
        <el-collapse>
          <el-collapse-item 
            v-for="(item, idx) in section.items" 
            :key="idx" 
            :title="item.question"
          >
            <div class="answer">
              {{ item.answer }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Document } from '@element-plus/icons-vue'

interface HelpItem {
  question: string
  answer: string
}

interface HelpSection {
  title: string
  items: HelpItem[]
}

export default defineComponent({
  name: 'Help',
  components: {
    Document
  },
  setup() {
    const helpSections = ref<HelpSection[]>([
      {
        title: '基本操作指南',
        items: [
          {
            question: '如何创建新的数据模板？',
            answer: '点击数据维护->数据模板，然后点击"添加模板"按钮，填写相关信息后保存即可。'
          },
          {
            question: '如何导入数据？',
            answer: '在专病数据页面，点击"导入数据"按钮，选择符合模板格式的Excel文件即可导入。'
          }
        ]
      },
      {
        title: '数据分析指南',
        items: [
          {
            question: '如何生成分析图表？',
            answer: '在图表分析页面，选择需要分析的数据字段和图表类型，系统会自动生成相应的可视化图表。'
          },
          {
            question: '如何导出分析结果？',
            answer: '在图表生成后，点击右上角的"导出"按钮，可以将图表导出为图片或PDF格式。'
          }
        ]
      }
    ])

    return {
      helpSections
    }
  }
})
</script>

<style scoped lang="scss">
.help-container {
  padding: 20px;
  
  .help-section {
    margin-bottom: 20px;

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: bold;
    }

    .section-content {
      .answer {
        padding: 10px;
        color: #666;
        line-height: 1.6;
      }
    }
  }
}
</style> 