import './dashboard.css';
import { Plus, TrendingUp, AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { BOARDS, THROUGHPUT_DATA, QUICK_STATS } from '../data/mockData';
import Topbar from '../components/Topbar';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <Topbar />
      <div className="dashboard-content">
        <div className="dash-header">
          <div>
            <h1 className="dash-title">Boards</h1>
            <p className="dash-sub">Manage manufacturing pipelines and factory workflow.</p>
          </div>
          <button className="btn btn-primary"><Plus size={14} /> Create Board</button>
        </div>

        {/* Board Cards Grid */}
        <div className="boards-grid">
          {BOARDS.map((board) => (
            <div key={board.id} className="board-card" onClick={() => navigate(`/board/${board.id}`)}>
              <div className="board-card-stripe" style={{ background: board.departmentColor }} />
              <div className="board-card-body">
                <div className="board-card-header">
                  <div className="board-card-title">
                    <span className="board-emoji">{board.emoji}</span>
                    <span>{board.title}</span>
                  </div>
                  <span className="board-updated">{board.lastUpdated}</span>
                </div>
                <p className="board-desc">{board.description}</p>
                <div className="board-card-footer">
                  <div className="avatar-stack">
                    {board.members.slice(0, 3).map((m, i) => (
                      <div key={m.id} className="avatar avatar-sm"
                        style={{ background: ['#0052CC','#6554C0','#FF8B00','#00875A','#36B37E'][i] }}>
                        {m.avatar}
                      </div>
                    ))}
                    {board.memberCount > 3 && (
                      <div className="avatar avatar-sm" style={{ background: 'var(--surface-3)' }}>
                        +{board.memberCount - 3}
                      </div>
                    )}
                  </div>
                  <div className="board-card-count" style={{ color: board.departmentColor }}>
                    {board.cardCount} Cards
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button className="board-card board-new" onClick={() => {}}>
            <Plus size={20} style={{ color: 'var(--text-muted)' }} />
            <span>New Department Board</span>
          </button>
        </div>

        {/* Bottom row: chart + stats */}
        <div className="dash-bottom">
          <div className="chart-card">
            <div className="chart-header">
              <span className="chart-title">Factory Throughput</span>
              <span className="chart-period">Last 7 Days ▾</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={THROUGHPUT_DATA} barSize={28}>
                <XAxis dataKey="day" axisLine={false} tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-heading)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="value" fill="rgba(0,82,204,0.5)" radius={[4,4,0,0]}
                  activeBar={{ fill: 'var(--primary)' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="stats-card">
            <div className="chart-title" style={{ marginBottom: 16 }}>Quick Stats</div>
            <div className="stat-row">
              <div className="stat-icon" style={{ background: 'rgba(0,82,204,0.15)' }}>
                <FileText size={14} style={{ color: 'var(--primary)' }} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Active Orders</div>
                <div className="stat-value">{QUICK_STATS.activeOrders} Items</div>
              </div>
              <span className="stat-delta positive">{QUICK_STATS.activeOrdersDelta}</span>
            </div>
            <div className="stat-row">
              <div className="stat-icon" style={{ background: 'rgba(222,53,11,0.15)' }}>
                <AlertTriangle size={14} style={{ color: 'var(--danger)' }} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Critical Orders</div>
                <div className="stat-value">{QUICK_STATS.criticalOrders} Issues</div>
              </div>
              <span className="stat-delta negative">-7</span>
            </div>
            <div className="stat-row">
              <div className="stat-icon" style={{ background: 'rgba(54,179,126,0.15)' }}>
                <TrendingUp size={14} style={{ color: 'var(--secondary)' }} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Open Invoices</div>
                <div className="stat-value">{QUICK_STATS.openInvoices} Pending</div>
              </div>
              <span className="stat-delta">1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
