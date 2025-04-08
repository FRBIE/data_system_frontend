<template>
  <div class="visualization-container">
    <div class="filter-section">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="时间范围">
          <el-date-picker
              v-model="filterForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item label="数据类型">
          <el-select v-model="filterForm.dataType" placeholder="请选择">
            <el-option label="全部" value="" />
            <el-option label="血压" value="bloodPressure" />
            <el-option label="血糖" value="bloodSugar" />
            <el-option label="心率" value="heartRate" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>年龄分布</span>
              <el-button type="text" @click="exportChart('ageDistribution')">
                导出
              </el-button>
            </div>
          </template>
          <div class="chart-container" ref="ageChart"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>性别比例</span>
              <el-button type="text" @click="exportChart('genderRatio')">
                导出
              </el-button>
            </div>
          </template>
          <div class="chart-container" ref="genderChart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>趋势分析</span>
              <el-button type="text" @click="exportChart('trendAnalysis')">
                导出
              </el-button>
            </div>
          </template>
          <div class="chart-container" ref="trendChart"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import {genderCountList} from "@/api/genderCount.ts";

export default defineComponent({
  name: 'Visualization',
  setup() {
    const filterForm = ref({
      dateRange: [],
      dataType: ''
    })

    const ageChart = ref<HTMLElement | null>(null)
    const genderChart = ref<HTMLElement | null>(null)
    const trendChart = ref<HTMLElement | null>(null)

    let ageChartInstance: ECharts | null = null
    let genderChartInstance: ECharts | null = null
    let trendChartInstance: ECharts | null = null

    const initAgeChart = () => {
      if (!ageChart.value) return
      ageChartInstance = echarts.init(ageChart.value)

      const option = {
        title: {
          text: '年龄分布'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['0-20', '21-40', '41-60', '61-80', '80+']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: [10, 52, 78, 45, 15],
          type: 'bar'
        }]
      }

      ageChartInstance.setOption(option)
    }

    const initGenderChart = (genderData: { 0: number; 1: number }) => {
      if (!genderChart.value) return
      genderChartInstance = echarts.init(genderChart.value)

      const option = {
        title: {
          text: '性别比例'
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'center',
          padding: [0, 20],
          itemWidth: 10,
          itemHeight: 10
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [
              { value: genderData[0], name: '女' },
              { value: genderData[1], name: '男' }
            ],
            label: {
              formatter: '{b}: {c} ({d}%)',
              position: 'outside',
              distanceToLabelLine: 10
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }

      genderChartInstance.setOption(option)
    }

    const initTrendChart = () => {
      if (!trendChart.value) return
      trendChartInstance = echarts.init(trendChart.value)

      const option = {
        title: {
          text: '趋势分析'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['确诊数', '治愈数']
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '确诊数',
            type: 'line',
            data: [150, 230, 224, 218, 135, 147]
          },
          {
            name: '治愈数',
            type: 'line',
            data: [80, 160, 190, 210, 120, 770]
          }
        ]
      }

      trendChartInstance.setOption(option)
    }

    const handleFilter = () => {
      // 实现筛选逻辑
      console.log('筛选条件:', filterForm.value)
    }

    const resetFilter = () => {
      filterForm.value = {
        dateRange: [],
        dataType: ''
      }
    }

    const exportChart = (type: string) => {
      // 实现导出逻辑
      console.log('导出图表:', type)
    }

    // 从后端获取性别比例数据
    const fetchGenderData = async () => {
      try {
        const response = await genderCountList()
        if (response.data.code === 200 && response.data.data) {
          initGenderChart(response.data.data)
        }
      } catch (error) {
        console.error('获取性别比例数据失败:', error)
      }
    }

    onMounted(() => {
      initAgeChart()
      initTrendChart()
      fetchGenderData()

      window.addEventListener('resize', () => {
        ageChartInstance?.resize()
        genderChartInstance?.resize()
        trendChartInstance?.resize()
      })
    })

    return {
      filterForm,
      ageChart,
      genderChart,
      trendChart,
      handleFilter,
      resetFilter,
      exportChart
    }
  }
})
</script>

<style scoped lang="scss">
.visualization-container {
  padding: 20px;

  .filter-section {
    margin-bottom: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
  }

  .chart-row {
    margin-bottom: 20px;

    .chart-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chart-container {
        height: 400px;
      }
    }
  }
}
</style>
