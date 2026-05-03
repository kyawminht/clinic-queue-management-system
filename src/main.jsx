import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { setupQueryCachePersistence } from './services/queryPersistence';
import { SubmissionProvider } from './context/SubmissionContext';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
});

setupQueryCachePersistence(queryClient);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SubmissionProvider>
          <AppProvider>
            <App />
          </AppProvider>
        </SubmissionProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
