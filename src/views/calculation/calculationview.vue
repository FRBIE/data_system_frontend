<template>
    <div class="attribute-container">
      <div class="attribute-header">
        <div class="left">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>添加计算属性
          </el-button>
        </div>
        <div class="right">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入计算属性名称"
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
  
      <!-- 计算属性列表 -->
      <el-table :data="filteredAttributes" style="width: 100%" border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="计算属性名称" />
        <el-table-column prop="formula" label="公式" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">查看</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        class="pagination"
      />
  
      <!-- 添加计算属性对话框 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="600px"
      >
        <el-form :model="formData" ref="formRef" label-width="100px">
          <el-form-item label="计算属性名称" prop="name">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="公式" prop="formula">
            <el-input v-model="formData.formula" />
          </el-form-item>
  
          <el-form-item label="备注" prop="remarks">
            <el-input
              type="textarea"
              v-model="formData.remarks"
              :rows="3"
              placeholder="请输入备注信息"
            />
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
    
  export default {
    data() {
      return {
        searchKeyword: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        dialogVisible: false,
        dialogTitle: '添加计算属性',
        formData: {
          name: '',
          formula: '',
          remarks: '',
        },
        attributes: [
          { name: '属性1', formula: 'A+B', remarks: '备注1' },
          { name: '属性2', formula: 'C-D', remarks: '备注2' },
        ],
      };
    },
    computed: {
      filteredAttributes() {
        return this.attributes.filter(attr =>
          attr.name.includes(this.searchKeyword)
        );
      },
    },
    methods: {
      handleAdd() {
        this.dialogVisible = true;
      },
      handleSubmit() {
        if (this.formData.name && this.formData.formula) {
          this.attributes.push({ ...this.formData });
          this.dialogVisible = false;
          this.formData = { name: '', formula: '', remarks: '' };
        } else {
          (this as any).$message.error('请填写计算属性名称和公式');
        }
      },
      handleDelete(attribute: any) {
        this.attributes = this.attributes.filter(attr => attr !== attribute);
      },
      handleView(attribute: { name: any; }) {
        (this as any).$message.info(`查看 ${attribute.name}`);
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  .attribute-container {
    padding: 20px;
    
    color:#DEDCC7;
    .attribute-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      
      .left {
        display: flex;
        gap: 10px;
      }
  
      .right {
        .search-input {
          width: 300px;
        }
      }
    }
  
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      
    }
  }
  </style>
  