import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);

// No StrictMode here: its dev-only remount (mount → unmount → remount) races
// with wujie's async startApp/destroy and tears down sub-app sandboxes.
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
