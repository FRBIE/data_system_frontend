import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Layout from '../layout/index.vue';
import DataTemplate from '../views/template/DataTemplate.vue';
import ChartAnalysis from '../views/chart/ChartAnalysis.vue';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      title: '登录',
      requiresAuth: false 
    }
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/template',
    children: [
      {
        path: 'help',
        name: 'Help',
        component: () => import('../views/Help.vue'),
        meta: { 
          title: '使用帮助',
          requiresAuth: true 
        }
      },
      {
        path: 'system',
        name: 'System',
        component: () => import('../views/system/SystemDict.vue'),
        meta: { 
          title: '系统词条',
          requiresAuth: true 
        }
      },
      {
        path: 'template',
        name: 'DataTemplate',
        component: DataTemplate,
        meta: { 
          title: '数据模板',
          requiresAuth: true 
        }
      },
      {
        path: 'calculation',
        name: 'Calculation',
        component: () => import('../views/calculation/calculationview.vue'),
        meta: { 
          title: '计算属性',
          requiresAuth: true 
        }
      },
      {
        path: 'disease',
        name: 'DiseaseData',
        component: () => import('../views/disease/DiseaseData.vue'),
        meta: { 
          title: '专病数据',
          requiresAuth: true 
        },
        children: [
          {
            path: 'diseaset',
            name: 'Diseaset',
            meta: { 
              title: '病例表格',
              requiresAuth: true 
            }
          }
        ]
      },
      {
        path: 'chart',
        name: 'ChartAnalysis',
        component: ChartAnalysis,
        meta: { 
          title: '图表分析',
          requiresAuth: true 
        }
      },
      {
        path: 'visualization',
        name: 'Visualization',
        component: () => import('../views/visualization/index.vue'),
        meta: { 
          title: '结果可视化',
          requiresAuth: true 
        }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
});

export default router;