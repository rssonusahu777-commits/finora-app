import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // While CSS file creation is discouraged by prompt, standard boilerplate often includes it. If styles are all Tailwind, this line can be removed or empty.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);