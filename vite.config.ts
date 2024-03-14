import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // mode에 따른 기본 route 변경
    base: env.VITE_ASSET_PATH,
    // webpack에서 지원하는 alias 기능.
    // @로 root directory 가리키게 설정. tsconfig.json에도 설정해야 vscode에서 @/ 인식함.
    plugins: [vue()],
    resolve: {
      alias: [
        { find:'@', replacement: fileURLToPath(new URL('./src', import.meta.url))},
        // asset directory 가리키기.
        { find:'@assets', replacement: fileURLToPath(new URL('./src/assets', import.meta.url)) }
      ]
    },
  }
})
