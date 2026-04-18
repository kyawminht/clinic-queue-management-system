import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import BookingPageContainer from './containers/BookingPageContainer';
import HomePageContainer from './containers/HomePageContainer';
import QueueStatusPageContainer from './containers/QueueStatusPageContainer';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePageContainer />} />
        <Route path="/booking/:doctorId" element={<BookingPageContainer />} />
        <Route path="/status" element={<QueueStatusPageContainer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export default App;
