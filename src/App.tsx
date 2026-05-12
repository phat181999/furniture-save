import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BoardView from './pages/BoardView';

function Placeholder({ title }: { title: string }) {
  return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)', fontSize: 16 }}>
      {title} — Coming Soon
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/board/:id" element={<BoardView />} />
            <Route path="/my-cards" element={<Placeholder title="My Cards" />} />
            <Route path="/notifications" element={<Placeholder title="Notifications" />} />
            <Route path="/analytics" element={<Placeholder title="Analytics" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
