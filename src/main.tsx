import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import ItemsPage from './pages/ItemsPage';
import AmmoPage from './pages/AmmoPage';
import TasksPage from './pages/TasksPage';
import BossesPage from './pages/BossesPage';
import StatusPage from './pages/StatusPage';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<ItemsPage />} />
            <Route path="ammo" element={<AmmoPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="bosses" element={<BossesPage />} />
            <Route path="status" element={<StatusPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  </StrictMode>,
);
