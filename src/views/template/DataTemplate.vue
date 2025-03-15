<template>
  <div class="template-container">
    <!-- 顶部导航区域 -->
    <div class="template-header">
      <div class="header-left">
        <el-button-group class="custom-button-group" >
  <el-button type="primary"plain >
    <img src="@/assets/2-1.png" class="button-icon" />
    全部数据模版
  </el-button>

  <el-button @click="handleAddBasicTemplate" > 
    <img src="@/assets/2-2.png" class="button-icon" />
    添加基础数据模版
  </el-button>

  <el-button @click="handleAddCustomTemplate">
    <img src="@/assets/2-2.png" class="button-icon" />
    添加自定义数据模版
  </el-button>
</el-button-group>

      </div>
      <div class="header-right">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入模版名称关键字"
          prefix-icon="el-icon-search"
          @input="filterTemplates"
        />
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="template-content">
      <!-- 基础数据模板 -->
      <div class="template-section">
        <h3>基础数据模板</h3>
        <el-table :data="filteredBasicTemplates" style="width: 100%" border stripe>
          <el-table-column prop="name" label="模版名称" width="200" />
          <el-table-column prop="code" label="模版编号" width="200" />
          <el-table-column prop="description" label="模版描述" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 自定义数据模板 -->
      <div class="template-section">
        <h3>自定义数据模板</h3>
        <el-table :data="filteredCustomTemplates" style="width: 100%" border stripe>
          <el-table-column prop="name" label="模版名称" width="200" />
          <el-table-column prop="code" label="模版编号" width="200" />
          <el-table-column prop="description" label="模版描述" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 对话框 - 添加/编辑模板 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="模版名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入模版名称" />
        </el-form-item>
        <el-form-item label="模版编号" prop="code">
          <el-input v-model="formData.code" placeholder="请输入模版编号" />
        </el-form-item>
        <el-form-item label="模版描述" prop="description">
          <el-input
            type="textarea"
            v-model="formData.description"
            placeholder="请输入模版描述"
          />
        </el-form-item>
        <el-form-item label="模板类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择模板类型">
            <el-option label="基础数据模板" value="basic" />
            <el-option label="自定义数据模板" value="custom" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

interface TemplateItem {
  id?: number
  name: string
  code: string
  description: string
  type: string
}

export default defineComponent({
  name: 'DataTemplate',
  setup() {
    const searchKeyword = ref('')
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref<FormInstance>()
    const formData = ref<TemplateItem>({
      name: '',
      code: '',
      description: '',
      type: 'basic'
    })

    const templateList = ref<TemplateItem[]>([
      {
        id: 1,
        name: '一般情况',
        code: 'PR598754612',
        description: '记录病例一般情况,包括年龄、性别、体重、身高、血型等信息',
        type: 'basic'
      },
      {
        id: 2,
        name: '手术信息',
        code: 'OP784548420',
        description: '记录手术日期和手术前后病人情况信息',
        type: 'basic'
      },
      {
        id: 3,
        name: '血常规',
        code: 'BL598495468',
        description: '包括白细胞、红细胞、中性粒细胞、血红蛋白等定量指标',
        type: 'basic'
      },
      {
        id: 4,
        name: '生化',
        code: 'CH888468421',
        description: '记录总蛋白、总胆红素、转氨酶等肝功能指标',
        type: 'basic'
      },
      {
        id: 5,
        name: '血气分析',
        code: 'BG578481354',
        description: '记录动脉血分析情况',
        type: 'basic'
      },
      {
        id: 6,
        name: '传染病',
        code: 'CR487121848',
        description: '记录乙肝表面抗原、抗体、E抗原、E抗体情况',
        type: 'basic'
      },
      {
        id: 7,
        name: '凝血',
        code: 'NX897823151',
        description: '记录凝血酶原时间、活动部分凝血美元时间、国际标准化比值等',
        type: 'basic'
      },
      {
        id: 8,
        name: '心脏彩超',
        code: 'CC159756125',
        description: '记录辅助检查信息，心脏彩超情况',
        type: 'custom'
      },
      {
        id: 9,
        name: '腹部CT',
        code: 'CT059789515',
        description: '记录辅助检查信息，腹部CT检查情况',
        type: 'custom'
      },
      {
        id: 10,
        name: '胸部CT',
        code: 'CT189756125',
        description: '记录祝福检查信息，胸部CT检查情况',
        type: 'custom'
      }
    ])

    const rules: FormRules = {
      name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
      code: [{ required: true, message: '请输入模版编号', trigger: 'blur' }],
      description: [{ required: true, message: '请输入模版描述', trigger: 'blur' }],
      type: [{ required: true, message: '请选择模板类型', trigger: 'change' }]
    }

    const dialogTitle = computed(() => isEdit.value ? '编辑模板' : '添加模板')

    const filteredBasicTemplates = computed(() => {
      return templateList.value.filter(item => item.type === 'basic' && 
        (item.name.includes(searchKeyword.value) || item.code.includes(searchKeyword.value)))
    })

    const filteredCustomTemplates = computed(() => {
      return templateList.value.filter(item => item.type === 'custom' && 
        (item.name.includes(searchKeyword.value) || item.code.includes(searchKeyword.value)))
    })

    const handleAddBasicTemplate = () => {
      isEdit.value = false
      formData.value = {
        name: '',
        code: '',
        description: '',
        type: 'basic'
      }
      dialogVisible.value = true
    }

    const handleAddCustomTemplate = () => {
      isEdit.value = false
      formData.value = {
        name: '',
        code: '',
        description: '',
        type: 'custom'
      }
      dialogVisible.value = true
    }

    const handleEdit = (row: TemplateItem) => {
      isEdit.value = true
      formData.value = { ...row }
      dialogVisible.value = true
    }

    const handleDelete = (row: TemplateItem) => {
      ElMessageBox.confirm('确定要删除该模板吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        templateList.value = templateList.value.filter(item => item.id !== row.id)
        ElMessage.success('删除成功')
      }).catch(() => {})
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      await formRef.value.validate((valid) => {
        if (valid) {
          if (isEdit.value) {
            const index = templateList.value.findIndex(item => item.id === formData.value.id)
            if (index > -1) {
              templateList.value[index] = { ...formData.value, id: formData.value.id }
            }
          } else {
            templateList.value.push({
              ...formData.value,
              id: Date.now()
            })
          }
          dialogVisible.value = false
          ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
        }
      })
    }

    const filterTemplates = () => {
      // 触发过滤逻辑
    }

    return {
      searchKeyword,
      templateList,
      filteredBasicTemplates,
      filteredCustomTemplates,
      dialogVisible,
      formData,
      formRef,
      rules,
      dialogTitle,
      handleAddBasicTemplate,
      handleAddCustomTemplate,
      handleEdit,
      handleDelete,
      handleSubmit,
      filterTemplates
    }
  }
})
</script>

<style scoped lang="scss">
.custom-button-group {
  .el-button {
    display: flex;
    align-items: center;
  }

  .button-icon {
    width: 25px;  // 设置图标大小
    height: 25px;
    margin-right: 8px; // 让图标和文字之间有一点间距
  }
}

.template-container {
  padding: 20px;
  background-color: #DEDCC7; /* 设置背景颜色 */
  min-height: 100vh;

  .template-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    background: #f5f5f5;
    padding: 10px 20px;
    border-bottom: 1px solid #e9e9e9;

    .header-left {
      .el-button-group {
        .el-button {
          margin-right: 10px;
        }
      }
    }

    .header-right {
      width: 300px;
    }
  }

  .template-content {
    padding: 20px;

    .template-section {
      margin-bottom: 30px;

      h3 {
        font-size: 18px;
        color: #333;
        margin-bottom: 10px;
      }

      .el-table {
        background: #fff;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
      }
    }
  }
}
</style>