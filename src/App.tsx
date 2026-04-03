import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Home from './pages/Home'
import JsonFormatter from './pages/JsonFormatter'
import SerializeToJson from './pages/SerializeToJson'
import Base64Codec from './pages/Base64Codec'
import TimestampConverter from './pages/TimestampConverter'
import UnicodeCodec from './pages/UnicodeCodec'
import UrlCodec from './pages/UrlCodec'
import QrCodeGenerator from './pages/QrCodeGenerator'
import BarcodeGenerator from './pages/BarcodeGenerator'
import RandomNumberGenerator from './pages/RandomNumberGenerator'
import RandomStringGenerator from './pages/RandomStringGenerator'
import MermaidRenderer from './pages/MermaidRenderer'
import MarkdownRenderer from './pages/MarkdownRenderer'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/json-formatter" element={<JsonFormatter />} />
          <Route path="/serialize-to-json" element={<SerializeToJson />} />
          <Route path="/base64" element={<Base64Codec />} />
          <Route path="/timestamp" element={<TimestampConverter />} />
          <Route path="/unicode" element={<UnicodeCodec />} />
          <Route path="/url-codec" element={<UrlCodec />} />
          <Route path="/qrcode" element={<QrCodeGenerator />} />
          <Route path="/barcode" element={<BarcodeGenerator />} />
          <Route path="/random-number" element={<RandomNumberGenerator />} />
          <Route path="/random-string" element={<RandomStringGenerator />} />
          <Route path="/mermaid" element={<MermaidRenderer />} />
          <Route path="/markdown" element={<MarkdownRenderer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
