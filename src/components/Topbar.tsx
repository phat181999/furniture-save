import { Search, Bell } from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';

interface Props { title?: string; subtitle?: string; }

const avatarColors = ['#0052CC','#6554C0','#FF8B00','#00875A','#36B37E'];

export default function Topbar({ title, subtitle }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={14} className="search-icon" />
        <input className="search-input" placeholder="Search boards, cards, or team members..." />
      </div>
      <div className="topbar-right">
        <button className="icon-btn" style={{ position: 'relative' }}>
          <Bell size={16} />
          <span className="notif-dot" />
        </button>
        <div className="avatar" style={{ background: avatarColors[0], cursor: 'pointer' }}>
          {CURRENT_USER.avatar}
        </div>
      </div>

      <style>{`
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--bg);
          position: sticky; top: 0; z-index: 10;
        }
        .topbar-search { position: relative; flex: 1; max-width: 400px; }
        .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .search-input {
          width: 100%; padding: 8px 12px 8px 32px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: var(--radius); color: var(--text);
          font-size: 13px; outline: none; font-family: inherit;
        }
        .search-input:focus { border-color: var(--primary); }
        .search-input::placeholder { color: var(--text-muted); }
        .topbar-right { display: flex; align-items: center; gap: 12px; }
        .icon-btn {
          width: 32px; height: 32px; border-radius: var(--radius);
          border: none; background: var(--surface); color: var(--text);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.15s;
        }
        .icon-btn:hover { background: var(--surface-2); color: var(--text-heading); }
        .notif-dot {
          position: absolute; top: 4px; right: 4px;
          width: 8px; height: 8px; background: var(--danger);
          border-radius: 50%; border: 2px solid var(--bg);
        }
      `}</style>
    </header>
  );
}
