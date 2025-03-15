import axios from 'axios'
import type { DictItem } from '../types/dict' // 假设有一个类型定义文件

// 配置 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // 替换为你的后端 API 基础路径
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 获取词条列表
export const fetchDictList = async (): Promise<DictItem[]> => {
  try {
    const response = await api.get('/dict')
    return response.data
  } catch (error) {
    console.error('获取词条列表失败:', error)
    throw error
  }
}

// 添加词条
export const addDictItem = async (item: DictItem): Promise<DictItem> => {
  try {
    const response = await api.post('/dict', item)
    return response.data
  } catch (error) {
    console.error('添加词条失败:', error)
    throw error
  }
}

// 编辑词条
export const updateDictItem = async (id: number, item: DictItem): Promise<DictItem> => {
  try {
    const response = await api.put(`/dict/${id}`, item)
    return response.data
  } catch (error) {
    console.error('编辑词条失败:', error)
    throw error
  }
}

// 删除词条
export const deleteDictItem = async (id: number): Promise<void> => {
  try {
    await api.delete(`/dict/${id}`)
  } catch (error) {
    console.error('删除词条失败:', error)
    throw error
  }
}