import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';

import { TrelloUpdates } from './pages/TrelloUpdates';
import { TeamProductivity } from './pages/TeamProductivity';
import { ClientGoals } from './pages/ClientGoals';
import { CalendarEvents } from './pages/CalendarEvents';
import { Login } from './pages/Login';

import { ThemeProvider } from './components/theme-provider';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<TrelloUpdates />} />
                <Route path="productivity" element={<TeamProductivity />} />
                <Route path="goals" element={<ClientGoals />} />
                <Route path="calendar" element={<CalendarEvents />} />
                <Route path="settings" element={<div className="p-8 text-white">Settings Page (Coming Soon)</div>} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
