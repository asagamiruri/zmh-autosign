import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monkey, { cdn } from 'vite-plugin-monkey'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: '签到测试',
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        // match: ['https://zhutix.com/tag/cursors/'],
        match: ['https://www.baidu.com/*', 'https://zhutix.com/tag/cursors/'],
        connect: ['zhutix.com', 'api.juejin.cn'], // connect 需要的是一个域名而不是url
      },
      build: {
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }),
  ],
})
