import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const domNode = document.getElementById('app')
if (!domNode) throw new Error('no root found')
const root = createRoot(domNode)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
