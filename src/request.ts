import axios from 'axios'


// 创建 Axios 实例
const myAxios = axios.create({
    baseURL: '/api',
    timeout: 60000,
    withCredentials: true,
})

// 全局请求拦截器
myAxios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error)
    },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
    function (response) {
        return response
    },
    function (error) {
        return Promise.reject(error)
    },
)

export default myAxios
