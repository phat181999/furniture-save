import './sidebar.css';
import { Home, CreditCard, Bell, BarChart2, Settings, Plus, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BOARDS, CURRENT_USER } from '../data/mockData';

const avatarColors = ['#0052CC','#6554C0','#FF8B00','#00875A','#36B37E'];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: CreditCard, label: 'My Cards', to: '/my-cards' },
    { icon: Bell, label: 'Notifications', to: '/notifications', badge: 3 },
    { icon: BarChart2, label: 'Analytics', to: '/analytics' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo" onClick={() => navigate('/')}>
        <div className="logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="14" rx="2" fill="#fff" opacity="0.9"/>
            <rect x="14" y="3" width="7" height="9" rx="2" fill="#fff" opacity="0.6"/>
          </svg>
        </div>
        <span className="logo-text">NTK Board</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ icon: Icon, label, to, badge }) => (
          <button key={to} className={`nav-item ${path === to ? 'active' : ''}`} onClick={() => navigate(to)}>
            <Icon size={16} />
            <span>{label}</span>
            {badge && <span className="nav-badge">{badge}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-section">
        <div className="section-label">MY BOARDS</div>
        {BOARDS.map((board) => (
          <button
            key={board.id}
            className={`board-item ${path === `/board/${board.id}` ? 'active' : ''}`}
            onClick={() => navigate(`/board/${board.id}`)}
          >
            <span className="board-dot" style={{ background: board.departmentColor }} />
            <span>{board.title}</span>
          </button>
        ))}
        <button className="new-board-btn" onClick={() => navigate('/new-board')}>
          <Plus size={14} /> New Board
        </button>
      </div>

      <div className="sidebar-footer">
        <button className="footer-item" onClick={() => navigate('/profile')}>
          <div className="avatar avatar-sm" style={{ background: avatarColors[0] }}>
            {CURRENT_USER.avatar}
          </div>
          <div className="footer-info">
            <div className="footer-name">{CURRENT_USER.name}</div>
            <div className="footer-role">FACTORY ADMIN</div>
          </div>
        </button>
        <button className="footer-item" style={{ marginTop: 4 }}>
          <HelpCircle size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Support</span>
        </button>
      </div>
    </aside>
  );
}
