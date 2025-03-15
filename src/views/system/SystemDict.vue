<template>
  <div class="dict-container">

    <!-- 内容区域 -->
    <div class="content">
      <!-- 右侧主内容 -->
      <div class="main-content">
        <div class="dict-header">
          <div class="button-group">
            <el-button type="primary" plain>
            <img src="@/assets/1-1.png" class="menu-icon" />
            全部词条
          </el-button>

          <el-button type="primary" plain @click="handleAdd">
            <img src="@/assets/1-2.png" class="menu-icon" />
            添加词条
          </el-button>

          </div>


          <el-input
            v-model="searchKeyword"
            placeholder="请输入关键字搜索"
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <el-table :data="filteredDictList" style="width: 100%" border stripe>
          <el-table-column prop="chineseName" label="中文名称" width="120" />
          <el-table-column prop="englishName" label="英文名称" width="150" />
          <el-table-column prop="englishAbbreviation" label="英文缩写" width="100" />
          <el-table-column prop="code" label="词条编号" width="120" />
          <el-table-column prop="type" label="词条类型" width="120">
            <template #default="{ row }">
              <el-tag :type="getTagType(row.type)">{{ row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="application" label="词条应用" width="120" />
          <el-table-column prop="alias" label="从属别名" width="120" />
          <el-table-column prop="actions" label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          :title="dialogTitle"
          v-model="dialogVisible"
          width="500px"
        >
          <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="中文名称" prop="chineseName">
              <el-input v-model="formData.chineseName" placeholder="请输入中文名称" />
            </el-form-item>
            <el-form-item label="英文名称" prop="englishName">
              <el-input v-model="formData.englishName" placeholder="请输入英文名称" />
            </el-form-item>
            <el-form-item label="英文缩写" prop="englishAbbreviation">
              <el-input v-model="formData.englishAbbreviation" placeholder="请输入英文缩写" />
            </el-form-item>
            <el-form-item label="词条编号" prop="code">
              <el-input v-model="formData.code" placeholder="请输入词条编号" />
            </el-form-item>
            <el-form-item label="词条类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择词条类型">
                <el-option label="模板类别" value="template" />
                <el-option label="临床信息" value="clinical" />
                <el-option label="检验指标" value="indicator" />
              </el-select>
            </el-form-item>
            <el-form-item label="词条应用" prop="application">
              <el-input v-model="formData.application" placeholder="请输入词条应用" />
            </el-form-item>
            <el-form-item label="从属别名" prop="alias">
              <el-input v-model="formData.alias" placeholder="请输入从属别名" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'

interface DictItem {
  id?: number
  chineseName: string
  englishName: string
  englishAbbreviation: string
  code: string
  type: string
  application: string
  alias: string
}

export default defineComponent({
  name: 'SystemDict',
  components: {
    Plus,
    Search
  },
  setup() {
    const searchKeyword = ref('')
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref<FormInstance>()

    const formData = ref<DictItem>({
      chineseName: '',
      englishName: '',
      englishAbbreviation: '',
      code: '',
      type: '',
      application: '',
      alias: ''
    })

    const dictList = ref<DictItem[]>([
      {
        id: 1,
        chineseName: '检验单',
        englishName: 'Testing Sheet',
        englishAbbreviation: 'TS',
        code: 'I895612',
        type: 'template',
        application: '模板类别',
        alias: '模板类别名称'
      },
      {
        id: 2,
        chineseName: '检查单',
        englishName: 'Examination Sheet',
        englishAbbreviation: 'ES',
        code: 'I895213',
        type: 'template',
        application: '模板类别',
        alias: '模板类别名称'
      },
      {
        id: 3,
        chineseName: '术前检查',
        englishName: 'Preoperative Examination',
        englishAbbreviation: 'PreE',
        code: 'I865214',
        type: 'clinical',
        application: '临床信息',
        alias: '检验指标'
      },
      {
        id: 4,
        chineseName: '术后检查',
        englishName: 'Postoperative Examination',
        englishAbbreviation: 'PostE',
        code: 'I895215',
        type: 'clinical',
        application: '临床信息',
        alias: '检验指标'
      }
    ])

    const rules = {
      chineseName: [{ required: true, message: '请输入中文名称', trigger: 'blur' }],
      englishName: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
      englishAbbreviation: [{ required: true, message: '请输入英文缩写', trigger: 'blur' }],
      code: [{ required: true, message: '请输入词条编号', trigger: 'blur' }],
      type: [{ required: true, message: '请选择词条类型', trigger: 'change' }],
      application: [{ required: true, message: '请输入词条应用', trigger: 'blur' }],
      alias: [{ required: true, message: '请输入从属别名', trigger: 'blur' }]
    }

    const dialogTitle = computed(() => isEdit.value ? '编辑词条' : '添加词条')

    const filteredDictList = computed(() => {
      if (!searchKeyword.value) return dictList.value
      return dictList.value.filter(item => 
        item.chineseName.includes(searchKeyword.value) || 
        item.englishName.includes(searchKeyword.value) ||
        item.englishAbbreviation.includes(searchKeyword.value) ||
        item.code.includes(searchKeyword.value) ||
        item.alias.includes(searchKeyword.value)
      )
    })

    const getTagType = (type: string) => {
      const typeMap: Record<string, string> = {
        template: 'warning',
        clinical: 'success',
        indicator: 'danger'
      }
      return typeMap[type] || 'info'
    }

    const handleAdd = () => {
      isEdit.value = false
      formData.value = {
        chineseName: '',
        englishName: '',
        englishAbbreviation: '',
        code: '',
        type: '',
        application: '',
        alias: ''
      }
      dialogVisible.value = true
    }

    const handleEdit = (row: DictItem) => {
      isEdit.value = true
      formData.value = { ...row }
      dialogVisible.value = true
    }

    const handleDelete = (row: DictItem) => {
      ElMessageBox.confirm(
        '确定要删除该词条吗？',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        dictList.value = dictList.value.filter(item => item.id !== row.id)
        ElMessage.success('删除成功')
      })
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate((valid) => {
        if (valid) {
          if (isEdit.value) {
            const index = dictList.value.findIndex(item => item.id === formData.value.id)
            if (index > -1) {
              dictList.value[index] = { ...formData.value }
            }
          } else {
            dictList.value.push({
              ...formData.value,
              id: Date.now()
            })
          }
          dialogVisible.value = false
          ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
        }
      })
    }

    return {
      searchKeyword,
      dialogVisible,
      formData,
      formRef,
      rules,
      dialogTitle,
      filteredDictList,
      getTagType,
      handleAdd,
      handleEdit,
      handleDelete,
      handleSubmit
    }
  }
})
</script>

<style scoped lang="scss">
.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.button-group {
  display: flex;
  gap: 10px; // 控制按钮之间的间距
}

.button-icon {
  margin-right: 5px;
}



.dict-container {
  height: 100vh;
  display: flex;
  flex-direction: column;

  .header {
    padding: 10px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e9e9e9;
    display: flex;
    justify-content: space-between;
    align-items: center;

    h1 {
      margin: 0;
      font-size: 18px;
      color: #333;
    }

    .sub-title {
      font-size: 12px;
      color: #666;
    }
  }

  .content {
    flex: 1;
    padding: 20px;
    overflow-y: auto;

    .main-content {
      width: 100%;

      .dict-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        align-items: center;

        .search-input {
          width: 300px;
        }
      }
    }
  }

  .el-table {
    margin-top: 10px;
    background-color: #fff;
    border: 1px solid #e9e9e9;
  }
}
</style>