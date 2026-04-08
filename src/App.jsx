import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import BookingPage from './pages/BookingPage';
import HomePage from './pages/HomePage';
import QueueStatusPage from './pages/QueueStatusPage';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking/:doctorId" element={<BookingPage />} />
        <Route path="/status" element={<QueueStatusPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
