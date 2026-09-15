import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { routerBasenameFromViteBase } from './utils/routerBasename'
import Layout from './components/Layout'
import KeepAlivePages from './components/KeepAlivePages'

const routerBasename = routerBasenameFromViteBase(import.meta.env.BASE_URL)

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="*" element={<KeepAlivePages basename={routerBasename} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
