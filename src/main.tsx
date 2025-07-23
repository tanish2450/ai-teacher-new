import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/rounded.css' // Import rounded UI styles
import './styles/theme.css' // Import modern theme styles

createRoot(document.getElementById("root")!).render(<App />);
