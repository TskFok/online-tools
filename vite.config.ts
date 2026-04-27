import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isGithubActions = Boolean(process.env.GITHUB_ACTIONS)
/** 仓库名形如 owner.github.io 时站点在域名根，base 为 / */
const isUserOrOrgRootSite =
  Boolean(repoName && /^[^/]+\.github\.io$/i.test(repoName))

function resolveBase(): string {
  if (!isGithubActions) return '/'
  if (isUserOrOrgRootSite) return '/'
  if (repoName) return `/${repoName}/`
  return '/'
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react(), tailwindcss()],
})
