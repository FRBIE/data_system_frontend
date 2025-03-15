import axios from 'axios'
import type { TemplateItem } from '../types/template' // 假设有一个类型定义文件

// 配置 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // 替换为你的后端 API 基础路径
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 获取模板列表
export const fetchTemplateList = async (): Promise<TemplateItem[]> => {
  try {
    const response = await api.get('/templates')
    return response.data
  } catch (error) {
    console.error('获取模板列表失败:', error)
    throw error
  }
}

// 添加模板
export const addTemplateItem = async (item: TemplateItem): Promise<TemplateItem> => {
  try {
    const response = await api.post('/templates', item)
    return response.data
  } catch (error) {
    console.error('添加模板失败:', error)
    throw error
  }
}

// 编辑模板
export const updateTemplateItem = async (id: number, item: TemplateItem): Promise<TemplateItem> => {
  try {
    const response = await api.put(`/templates/${id}`, item)
    return response.data
  } catch (error) {
    console.error('编辑模板失败:', error)
    throw error
  }
}

// 删除模板
export const deleteTemplateItem = async (id: number): Promise<void> => {
  try {
    await api.delete(`/templates/${id}`)
  } catch (error) {
    console.error('删除模板失败:', error)
    throw error
  }
}