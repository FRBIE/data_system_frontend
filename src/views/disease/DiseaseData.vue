<template>
  <div class="disease-table-container">
    <!-- 头部操作区域 -->
    <div class="table-header">
      <div class="header-left">
        <!-- 添加“全部病例”按钮 -->
        <el-button type="info" >
          <el-icon><Menu /></el-icon>专病分类
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>录入病例
        </el-button>
        <el-upload
          class="upload-btn"
          action="#"
          :auto-upload="false"
          :show-file-list="false"
          accept=".xlsx,.xls"
          @change="handleFileChange"
        >
          <el-button type="success">
            <el-icon><Upload /></el-icon>导入数据
          </el-button>
        </el-upload>
        <el-button type="warning" @click="handleExport">
          <el-icon><Download /></el-icon>导出数据
        </el-button>
      </div>
      <div class="header-right">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入病例编号/患者姓名"
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </div>

    <!-- 表格区域 -->
    <el-table :data="filteredDiseaseList" style="width: 100%" border stripe>
      <el-table-column prop="archiveNo" label="归档号" width="150" />
      <el-table-column prop="idNo" label="身份证号" width="200" />
      <el-table-column prop="caseNo" label="病例号" width="150" />
      <el-table-column prop="hospitalNo" label="住院号" width="150" />
      <el-table-column prop="completion" label="病例完成度" width="150">
        <template #default="{ row }">
          <el-progress :percentage="row.completion" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleView(row)">查看</el-button>
          <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 录入病例对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="600px"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="归档号" prop="archiveNo">
          <el-input v-model="formData.archiveNo" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="身份证号" prop="idNo">
          <el-input v-model="formData.idNo" />
        </el-form-item>
        <el-form-item label="病例号" prop="caseNo">
          <el-input v-model="formData.caseNo" />
        </el-form-item>
        <el-form-item label="住院号" prop="hospitalNo">
          <el-input v-model="formData.hospitalNo" />
        </el-form-item>
        <el-form-item label="病例完成度" prop="completion">
          <el-input-number v-model="formData.completion" :min="0" :max="100" />
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
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Upload, Download, Search, Menu } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'

interface DiseaseData {
  id?: number
  archiveNo: string
  idNo: string
  caseNo: string
  hospitalNo: string
  completion: number
}

export default defineComponent({
  name: 'DiseaseTable',
  components: {
    Plus,
    Upload,
    Download,
    Search,
    Menu // 添加 Menu 图标组件
  },
  setup() {
    const router = useRouter()
    const searchKeyword = ref('')
    const dialogVisible = ref(false)
    const isEdit = ref(false)
    const formRef = ref<FormInstance>()

    const formData = ref<DiseaseData>({
      archiveNo: '',
      idNo: '',
      caseNo: '',
      hospitalNo: '',
      completion: 0
    })

    const diseaseList = ref<DiseaseData[]>([
      {
        id: 1,
        archiveNo: 'ARCH001',
        idNo: '110101199003074433',
        caseNo: 'CASE001',
        hospitalNo: 'HOSP001',
        completion: 75
      },
      {
        id: 2,
        archiveNo: 'ARCH002',
        idNo: '110101199505062211',
        caseNo: 'CASE002',
        hospitalNo: 'HOSP002',
        completion: 50
      }
    ])

    const rules = {
      archiveNo: [{ required: true, message: '请输入归档号', trigger: 'blur' }],
      idNo: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
      caseNo: [{ required: true, message: '请输入病例号', trigger: 'blur' }],
      hospitalNo: [{ required: true, message: '请输入住院号', trigger: 'blur' }],
      completion: [{ required: true, message: '请输入病例完成度', trigger: 'blur' }]
    }

    const dialogTitle = computed(() => isEdit.value ? '编辑病例' : '录入病例')

    const filteredDiseaseList = computed(() => {
      if (!searchKeyword.value) return diseaseList.value
      const keyword = searchKeyword.value.toLowerCase()
      return diseaseList.value.filter(item => 
        item.archiveNo.toLowerCase().includes(keyword) || 
        item.idNo.toLowerCase().includes(keyword) ||
        item.caseNo.toLowerCase().includes(keyword) ||
        item.hospitalNo.toLowerCase().includes(keyword)
      )
    })

    const handleAdd = () => {
      isEdit.value = false
      formData.value = {
        archiveNo: '',
        idNo: '',
        caseNo: '',
        hospitalNo: '',
        completion: 0
      }
      dialogVisible.value = true
    }

    const handleEdit = (row: DiseaseData) => {
      isEdit.value = true
      formData.value = { ...row }
      dialogVisible.value = true
    }

    const handleView = (row: DiseaseData) => {
      console.log('查看详情:', row)
    }

    const handleDelete = (row: DiseaseData) => {
      ElMessageBox.confirm(
        '确定要删除该病例吗？',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        diseaseList.value = diseaseList.value.filter(item => item.id !== row.id)
        ElMessage.success('删除成功')
      })
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      
      await formRef.value.validate((valid) => {
        if (valid) {
          if (isEdit.value) {
            const index = diseaseList.value.findIndex(item => item.id === formData.value.id)
            if (index > -1) {
              diseaseList.value[index] = { ...formData.value }
            }
          } else {
            diseaseList.value.push({
              ...formData.value,
              id: Date.now()
            })
          }
          dialogVisible.value = false
          ElMessage.success(isEdit.value ? '编辑成功' : '录入成功')
        }
      })
    }

    const handleFileChange = (file: File) => {
      console.log('选择的文件:', file)
    }

    const handleExport = () => {
      console.log('导出数据')
    }

    const handleAllCasesClick = () => {
      router.push('/dashboard/Diseaset')
    }

    return {
      searchKeyword,
      dialogVisible,
      formData,
      formRef,
      rules,
      dialogTitle,
      filteredDiseaseList,
      isEdit,
      handleAdd,
      handleEdit,
      handleView,
      handleDelete,
      handleSubmit,
      handleFileChange,
      handleExport,
      handleAllCasesClick
    }
  }
})
</script>

<style scoped lang="scss">
.disease-table-container {
  padding: 20px;
  background: #F0F2F5; /* 主页面背景色 */
  min-height: 100vh;
  width: 100vw;

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center; /* 垂直居中对齐 */
    margin-bottom: 20px;
    flex-wrap: wrap; /* 允许换行 */

    .header-left {
      display: flex;
      gap: 10px;
      flex-wrap: wrap; /* 允许按钮换行 */
    }

    .header-right {
      .search-input {
        width: 300px;
      }
    }
  }

  .el-table {
    border: 1px solid #e9e9e9;
  }
}
</style>