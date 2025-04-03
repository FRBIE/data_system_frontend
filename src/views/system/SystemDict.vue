<template>
  <div class="dict-container">

    <!-- 内容区域 -->
    <div class="content">
      <!-- 右侧主内容 -->
      <div class="main-content">
        <div class="dict-header">
          <div class="button-group">
            <el-button word_class="primary" plain>
            <img src="@/assets/1-1.png" class="menu-icon" />
            全部词条
          </el-button>

          <el-button word_class="primary" plain @click="handleAdd">
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
          <el-table-column prop="word_name" label="中文名称" width="120" />
          <el-table-column prop="word_eng" label="英文名称" width="150" />
          <el-table-column prop="word_short" label="英文缩写" width="100" />
          <el-table-column prop="word_code" label="词条编号" width="120" />
          <el-table-column prop="word_class" label="词条类型" width="120">
            <template #default="{ row }">
              <el-tag :word_class="getTagword_class(row.word_class)">{{ row.word_class }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="word_apply" label="词条应用" width="120" />
          <el-table-column prop="word_belong" label="从属别名" width="120" />
          <el-table-column prop="actions" label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button size="small" @click="handleEdit(row)">编辑</el-button>
              <el-button size="small" word_class="danger" @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          :title="dialogTitle"
          v-model="dialogVisible"
          width="500px"
        >
          <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="中文名称" prop="word_name">
              <el-input v-model="formData.word_name" placeholder="请输入中文名称" />
            </el-form-item>
            <el-form-item label="英文名称" prop="word_eng">
              <el-input v-model="formData.word_eng" placeholder="请输入英文名称" />
            </el-form-item>
            <el-form-item label="英文缩写" prop="word_short">
              <el-input v-model="formData.word_short" placeholder="请输入英文缩写" />
            </el-form-item>
            <el-form-item label="词条编号" prop="word_code">
              <el-input v-model="formData.word_code" placeholder="请输入词条编号" />
            </el-form-item>
            <el-form-item label="词条类型" prop="word_class">
              <el-select v-model="formData.word_class" placeholder="请选择词条类型">
                <el-option label="模板类别" value="template" />
                <el-option label="临床信息" value="clinical" />
                <el-option label="检验指标" value="indicator" />
              </el-select>
            </el-form-item>
            <el-form-item label="词条应用" prop="word_apply">
              <el-input v-model="formData.word_apply" placeholder="请输入词条应用" />
            </el-form-item>
            <el-form-item label="从属别名" prop="word_belong">
              <el-input v-model="formData.word_belong" placeholder="请输入从属别名" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button word_class="primary" @click="handleSubmit">确 定</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, ref, computed, onMounted} from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dictionaryList, dictionaryCreate, dictionaryUpdate, dictionaryDelete } from '@/api/dictionary'

interface DictItem {
  id?: number
  word_name: string
  word_eng: string
  word_short: string
  word_code: string
  word_class: string
  word_apply: string
  word_belong: string
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
    const formRef = ref()

    const formData = ref<DictItem>({
      word_name: '',
      word_eng: '',
      word_short: '',
      word_code: '',
      word_class: '',
      word_apply: '',
      word_belong: ''
    })

    const dictList = ref<DictItem[]>([])

    const rules = {
      word_name: [{ required: true, message: '请输入中文名称', trigger: 'blur' }],
      word_eng: [{ required: true, message: '请输入英文名称', trigger: 'blur' }],
      word_short: [{ required: true, message: '请输入英文缩写', trigger: 'blur' }],
      word_code: [{ required: true, message: '请输入词条编号', trigger: 'blur' }],
      word_class: [{ required: true, message: '请选择词条类型', trigger: 'change' }],
      word_apply: [{ required: true, message: '请输入词条应用', trigger: 'blur' }],
      word_belong: [{ required: true, message: '请输入从属别名', trigger: 'blur' }]
    }

    const dialogTitle = computed(() => isEdit.value ? '编辑词条' : '添加词条')

    const filteredDictList = computed(() => {
      if (!searchKeyword.value) return dictList.value
      return dictList.value.filter(item =>
          item.word_name.includes(searchKeyword.value) ||
          item.word_eng.includes(searchKeyword.value) ||
          item.word_short.includes(searchKeyword.value) ||
          item.word_code.includes(searchKeyword.value) ||
          item.word_belong.includes(searchKeyword.value)
      )
    })

    const getTagword_class = (word_class: string) => {
      const word_classMap: Record<string, string> = {
        template: 'warning',
        clinical: 'success',
        indicator: 'danger'
      }
      return word_classMap[word_class] || 'info'
    }

    // 获取词条列表
    const fetchDictList = async () => {
      // debugger
      try {
        const res = await dictionaryList({})
        console.log(JSON.stringify(res.data.data))
        dictList.value = res.data.data.list
      } catch (error) {
        console.error('获取词条列表失败:', error)
        ElMessage.error('获取词条列表失败')
      }
    }

    const handleAdd = () => {
      isEdit.value = false
      formData.value = {
        word_name: '',
        word_eng: '',
        word_short: '',
        word_code: '',
        word_class: '',
        word_apply: '',
        word_belong: ''
      }
      dialogVisible.value = true
    }

    const handleEdit = (row: DictItem) => {
      isEdit.value = true
      formData.value = { ...row }
      dialogVisible.value = true
    }

    const handleDelete = async (row: DictItem) => {
      try {
        await ElMessageBox.confirm(
            '确定要删除该词条吗？',
            '警告',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              word_class: 'warning'
            }
        )

        if (row.id) {
          await dictionaryDelete({ id: row.id })
          await fetchDictList()
          ElMessage.success('删除成功')
        }
      } catch (error) {
        console.error('删除词条失败:', error)
      }
    }

    const handleSubmit = async () => {
      if (!formRef.value) return

      try {
        await formRef.value.validate(async (valid: boolean) => {
          if (valid) {
            if (isEdit.value && formData.value.id) {
              // 编辑词条
              await dictionaryUpdate({
                id: formData.value.id
              }, formData.value)
              ElMessage.success('编辑成功')
            } else {
              // 添加词条
              await dictionaryCreate(formData.value)
              ElMessage.success('添加成功')
            }
            await fetchDictList()
            dialogVisible.value = false
          }
        })
      } catch (error) {
        console.error('操作失败:', error)
        ElMessage.error('操作失败')
      }
    }

    onMounted(() => {
      fetchDictList()
    })

    return {
      searchKeyword,
      dialogVisible,
      formData,
      formRef,
      rules,
      dialogTitle,
      dictList,
      filteredDictList,
      getTagword_class,
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
