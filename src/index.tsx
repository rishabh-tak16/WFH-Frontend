import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'rsuite/dist/rsuite.min.css';

import AppRoutes from './Routes/routes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);

