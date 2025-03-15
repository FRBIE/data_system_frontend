import axios from 'axios'
import type { DiseaseData } from '../types/disease' // 假设有一个类型定义文件

// 配置 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // 替换为你的后端 API 基础路径
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 获取病例列表
export const fetchDiseaseList = async (keyword: string = ''): Promise<DiseaseData[]> => {
  try {
    const response = await api.get('/diseases', {
      params: { keyword }
    })
    return response.data
  } catch (error) {
    console.error('获取病例列表失败:', error)
    throw error
  }
}

// 添加病例
export const addDisease = async (item: DiseaseData): Promise<DiseaseData> => {
  try {
    const response = await api.post('/diseases', item)
    return response.data
  } catch (error) {
    console.error('添加病例失败:', error)
    throw error
  }
}

// 更新病例
export const updateDisease = async (id: number, item: DiseaseData): Promise<DiseaseData> => {
  try {
    const response = await api.put(`/diseases/${id}`, item)
    return response.data
  } catch (error) {
    console.error('更新病例失败:', error)
    throw error
  }
}

// 删除病例
export const deleteDisease = async (id: number): Promise<void> => {
  try {
    await api.delete(`/diseases/${id}`)
  } catch (error) {
    console.error('删除病例失败:', error)
    throw error
  }
}