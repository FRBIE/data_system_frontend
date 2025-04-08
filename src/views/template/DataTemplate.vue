<template>
  <div class="template-container">
    <!-- 顶部导航区域 -->
    <div class="template-header">
      <div class="header-left">
        <el-button-group class="custom-button-group">
          <el-button type="primary" plain>
            <img src="@/assets/2-1.png" class="button-icon" />
            全部数据模版
          </el-button>
          <el-button @click="handleAddBasicTemplate">
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
      <!-- 基础数据模板列表 -->
      <div class="template-section">
        <h3>基础数据模板</h3>
        <el-table :data="filteredBasicTemplates" style="width: 100%" border stripe>
          <!-- 模板名称 -->
          <el-table-column prop="name" label="模版名称" width="200" />
          <!-- 模板编号 -->
          <el-table-column prop="id" label="模板编号" width="200" />
          <!-- 模板分类 -->
          <el-table-column prop="category_name" label="模板分类" width="200" />
          <el-table-column prop="description" label="模版描述" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 自定义数据模板列表 -->
      <div class="template-section">
        <h3>自定义数据模板</h3>
        <el-table :data="filteredCustomTemplates" style="width: 100%" border stripe>
          <!-- 模板名称 -->
          <el-table-column prop="name" label="模版名称" width="200" />
          <!-- 模板编号 -->
          <el-table-column prop="id" label="模板编号" width="200" />
          <!-- 模板分类 -->
          <el-table-column prop="category_name" label="模板分类" width="200" />
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
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <!-- 模板编号：添加时提示自动生成，编辑时回填 -->
        <el-form-item label="模板编号" prop="id">
          <el-input
              v-model="formData.id"
              placeholder="模板编号由系统自动生成，无需填写"
              disabled
          />
        </el-form-item>
        <el-form-item label="模版名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入模版名称" />
        </el-form-item>
        <el-form-item label="模版描述" prop="description">
          <el-input type="textarea" v-model="formData.description" placeholder="请输入模版描述" />
        </el-form-item>
        <el-form-item label="模板分类" prop="category_id">
          <el-select v-model="formData.category_id" placeholder="请选择模板分类">
            <el-option
                v-for="cat in categoryList"
                :key="cat.id"
                :label="cat.name"
                :value="cat.id"
            />
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
import {
  dataTemplatesList,
  dataTemplatesCreate,
  dataTemplatesUpdate,
  dataTemplatesDelete
} from '../../api/dataTemplates'
import { categoriesList } from "@/api/categories.ts";

interface TemplateItem {
  id?: number
  name: string
  description: string
  // 移除 code 与 type 字段
  category_id?: number
  category_name?: string
  used_n?: number
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
      description: '',
      category_id: undefined
    })
    const templateList = ref<TemplateItem[]>([])

    // 从后端获取的模板分类列表
    const categoryList = ref<Array<{ id: number; name: string }>>([])

    const rules: FormRules = {
      name: [{ required: true, message: '请输入模版名称', trigger: 'blur' }],
      description: [{ required: true, message: '请输入模版描述', trigger: 'blur' }],
      category_id: [{ required: true, message: '请选择模板分类', trigger: 'change' }]

    }

    const dialogTitle = computed(() => (isEdit.value ? '编辑模板' : '添加模板'))

    // 分组过滤：基于后端返回的模板分类名称区分
    const filteredBasicTemplates = computed(() => {
      return templateList.value.filter(item =>
          item.category_name === '基础数据模板' &&
          item.name.includes(searchKeyword.value)
      )
    })

    const filteredCustomTemplates = computed(() => {
      return templateList.value.filter(item =>
          item.category_name === '自定义数据模板' &&
          item.name.includes(searchKeyword.value)
      )
    })

    const fetchTemplates = async () => {
      try {
        const response = await dataTemplatesList({})
        console.log(JSON.stringify(response.data.data))
        // 直接使用后端返回的模板数据（字段中包含 id、category_id 与 category_name）
        templateList.value = response.data.data.list || []
      } catch (error) {
        ElMessage.error('获取模板列表失败')
        templateList.value = []
        console.error(error)
      }
    }

    // 获取模板分类数据
    const fetchCategories = async () => {
      try {
        const response = await categoriesList()
        categoryList.value = response.data.data.list || []
      } catch (error) {
        ElMessage.error('获取模板分类失败')
        categoryList.value = []
        console.error(error)
      }
    }

    // 辅助函数：根据分类名称查找对应的 category_id
    const getCategoryId = (name: string): number | undefined => {
      const cat = categoryList.value.find(item => item.name === name)
      return cat ? cat.id : undefined
    }

    fetchTemplates()
    fetchCategories()

    // 添加基础数据模板时，自动设置 category_id 为“基础数据模板”的 id
    const handleAddBasicTemplate = () => {
      isEdit.value = false
      formData.value = {
        name: '',
        description: '',
        category_id: getCategoryId('基础数据模板')
      }
      dialogVisible.value = true
    }

    // 添加自定义数据模板时，自动设置 category_id 为“自定义数据模板”的 id
    const handleAddCustomTemplate = () => {
      isEdit.value = false
      formData.value = {
        name: '',
        description: '',
        category_id: getCategoryId('自定义数据模板')
      }
      dialogVisible.value = true
    }

    const handleEdit = (row: TemplateItem) => {
      isEdit.value = true
      // 如果 row 中不存在 category_id，则根据 category_name 从 categoryList 查找对应的 id
      let category_id = row.category_id
      if (!category_id && row.category_name) {
        const found = categoryList.value.find(cat => cat.name === row.category_name)
        if (found) {
          category_id = found.id
        }
      }
      formData.value = { ...row, category_id }
      dialogVisible.value = true
    }

    const handleDelete = async (row: TemplateItem) => {
      try {
        await ElMessageBox.confirm('确定要删除该模板吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await dataTemplatesDelete({ id: row.id! })
        // 重新获取模板列表数据，确保显示最新数据
        await fetchTemplates()
        ElMessage.success('删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('删除失败')
          console.error(error)
        }
      }
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      await formRef.value.validate(async (valid) => {
        if (valid) {
          try {
            if (isEdit.value) {
              await dataTemplatesUpdate({ id: formData.value.id! }, formData.value)
              ElMessage.success('编辑成功')
            } else {
              await dataTemplatesCreate(formData.value)
              ElMessage.success('添加成功')
            }
            // 重新获取模板列表数据，确保显示最新数据
            await fetchTemplates()
            dialogVisible.value = false
          } catch (error) {
            ElMessage.error(isEdit.value ? '编辑失败' : '添加失败')
            console.error(error)
          }
        }
      })
    }

    const filterTemplates = () => {
      // 已通过 computed 实现局部过滤
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
      categoryList,
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
    width: 25px;
    height: 25px;
    margin-right: 8px;
  }
}
.template-container {
  padding: 20px;
  background-color: #dedcc7;
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
