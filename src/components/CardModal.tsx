import { useState } from 'react';
import { X, Tag, Users, Calendar, Paperclip, Archive, Trash2, BarChart2 } from 'lucide-react';
import { Card } from '../data/mockData';

interface Props { card: Card; onClose: () => void; }

const avatarColors = ['#0052CC','#6554C0','#FF8B00','#00875A','#36B37E'];

function priorityClass(p: string) {
  return { urgent: 'badge-urgent', high: 'badge-high', medium: 'badge-medium', low: 'badge-low' }[p] || 'badge-low';
}
function statusClass(s: string) {
  return { in_progress: 'badge-inprogress', blocked: 'badge-blocked', done: 'badge-done', todo: 'badge-low' }[s] || 'badge-low';
}

export default function CardModal({ card, onClose }: Props) {
  const [checklist, setChecklist] = useState(card.checklists[0]?.items || []);
  const isDailyReport = card.cardType === 'daily_report';
  const [progress, setProgress] = useState(card.reportProgress || 0);

  const checkedCount = checklist.filter(i => i.checked).length;
  const total = checklist.length;
  const pct = total ? Math.round((checkedCount / total) * 100) : 0;

  const toggle = (id: string) =>
    setChecklist(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal card-modal">
        <button className="modal-close" onClick={onClose}><X size={16} /></button>

        <div className="card-modal-inner">
          {/* LEFT */}
          <div className="card-modal-left">
            {isDailyReport && (
              <div className="card-type-tag">
                <BarChart2 size={12} /> DAILY_REPORT_{card.id.replace('c', '77')}
              </div>
            )}
            <h2 className="card-modal-title">{card.title}</h2>

            {/* Labels row */}
            <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
              {card.projectCode && (
                <span className="label-chip" style={{ background: 'rgba(0,82,204,0.2)', color: '#4C9AFF', border: '1px solid rgba(0,82,204,0.3)' }}>
                  {card.projectCode}
                </span>
              )}
              <span className={`badge ${priorityClass(card.priority)}`}>
                {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
              </span>
            </div>

            {/* Daily Report */}
            {isDailyReport ? (
              <DailyReportForm card={card} progress={progress} setProgress={setProgress} />
            ) : (
              <>
                {/* Description */}
                <div className="modal-section">
                  <div className="modal-section-title">DESCRIPTION</div>
                  <div className="card-description">{card.description}</div>
                </div>

                {/* Checklist */}
                {total > 0 && (
                  <div className="modal-section">
                    <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                      <div className="modal-section-title" style={{ marginBottom: 0 }}>
                        {card.checklists[0]?.title?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pct}%</span>
                    </div>
                    <div className="progress-bar" style={{ marginBottom: 12 }}>
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    {checklist.map(item => (
                      <div key={item.id} className={`checkbox-item ${item.checked ? 'checked' : ''}`}>
                        <input type="checkbox" checked={item.checked} onChange={() => toggle(item.id)} />
                        <span style={{ fontSize: 13 }}>{item.content}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Attachments */}
                {card.attachments.length > 0 && (
                  <div className="modal-section">
                    <div className="modal-section-title">ATTACHMENTS ({card.attachments.length})</div>
                    <div className="attachments-grid">
                      {card.attachments.slice(0, 3).map(a => (
                        <img key={a.id} src={a.url} alt={a.name} className="attachment-thumb" />
                      ))}
                      <div className="attachment-upload">
                        <Paperclip size={16} />
                        <span>UPLOAD</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity */}
                {card.activities.length > 0 && (
                  <div className="modal-section">
                    <div className="modal-section-title">ACTIVITY</div>
                    {card.activities.map(a => (
                      <div key={a.id} className="activity-row">
                        <div className="avatar avatar-sm" style={{ background: '#0052CC', flexShrink: 0 }}>
                          {a.user.avatar}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{a.user.name}</span>{' '}
                          {a.action}
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{a.timestamp}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* RIGHT */}
          {!isDailyReport && (
            <div className="card-modal-right">
              <div className="right-section">
                <div className="right-title">ADD TO CARD</div>
                {[{ icon: Users, label: 'Members' }, { icon: Tag, label: 'Labels' }, { icon: Calendar, label: 'Dates' }].map(({ icon: Icon, label }) => (
                  <button key={label} className="right-btn"><Icon size={13} />{label}</button>
                ))}
              </div>
              <div className="right-section">
                <div className="right-title">PRIORITY</div>
                <span className={`badge ${priorityClass(card.priority)}`} style={{ display: 'inline-flex' }}>
                  ● {card.priority.charAt(0).toUpperCase() + card.priority.slice(1)}
                </span>
              </div>
              <div className="right-section">
                <div className="right-title">STATUS</div>
                <span className={`badge ${statusClass(card.status)}`} style={{ display: 'inline-flex' }}>
                  {card.status === 'in_progress' ? 'In Progress' : card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                </span>
              </div>
              {card.dueDate && (
                <div className="right-section">
                  <div className="right-title">DUE DATE</div>
                  <span style={{ fontSize: 13, color: 'var(--text-heading)' }}>
                    {new Date(card.dueDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              )}
              {card.assignees.length > 0 && (
                <div className="right-section">
                  <div className="right-title">ASSIGNED</div>
                  <div className="avatar-stack">
                    {card.assignees.map((u, i) => (
                      <div key={u.id} className="avatar" style={{ background: avatarColors[i % avatarColors.length] }}>
                        {u.avatar}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="right-section" style={{ marginTop: 16 }}>
                <button className="right-btn" style={{ color: 'var(--text-muted)' }}><Archive size={13} />Archive</button>
                <button className="right-btn" style={{ color: 'var(--danger)' }}><Trash2 size={13} />Delete</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .card-modal { max-width: 760px; padding: 0; }
        .modal-close {
          position: absolute; top: 14px; right: 14px;
          width: 28px; height: 28px; border-radius: 6px;
          border: none; background: var(--surface-2); color: var(--text-muted);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          z-index: 1; transition: all 0.15s;
        }
        .modal-close:hover { background: var(--surface-3); color: var(--text-heading); }
        .card-modal-inner { display: flex; }
        .card-modal-left { flex: 1; padding: 24px; min-width: 0; }
        .card-modal-right { width: 200px; flex-shrink: 0; padding: 24px 16px; border-left: 1px solid var(--border); }
        .card-type-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: var(--text-muted); letter-spacing: 0.5px; margin-bottom: 8px; font-family: monospace; }
        .card-modal-title { font-size: 18px; font-weight: 700; color: var(--text-heading); margin-bottom: 12px; line-height: 1.3; }
        .modal-section { margin-top: 20px; }
        .modal-section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.8px; color: var(--text-muted); margin-bottom: 10px; }
        .card-description { font-size: 13px; color: var(--text); line-height: 1.7; background: var(--surface-2); padding: 12px; border-radius: var(--radius); }
        .attachments-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .attachment-thumb { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 6px; cursor: pointer; transition: opacity 0.15s; }
        .attachment-thumb:hover { opacity: 0.8; }
        .attachment-upload { aspect-ratio: 1; border: 1px dashed var(--border); border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; color: var(--text-muted); font-size: 10px; cursor: pointer; transition: all 0.15s; }
        .attachment-upload:hover { border-color: var(--primary); color: var(--primary); }
        .activity-row { display: flex; gap: 10px; margin-bottom: 12px; font-size: 13px; }
        .right-title { font-size: 10px; font-weight: 700; letter-spacing: 0.8px; color: var(--text-muted); margin-bottom: 8px; }
        .right-section { margin-bottom: 16px; }
        .right-btn { width: 100%; display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: var(--radius); border: none; background: var(--surface-2); color: var(--text); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; margin-bottom: 6px; }
        .right-btn:hover { background: var(--surface-3); }
      `}</style>
    </div>
  );
}

function DailyReportForm({ card, progress, setProgress }: { card: Card; progress: number; setProgress: (v: number) => void }) {
  return (
    <div>
      <div className="modal-section">
        <div className="modal-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>📊 Tiến Độ Hoàn Thành</span>
          <span style={{ color: 'var(--primary)', fontSize: 14, fontWeight: 700 }}>{progress}%</span>
        </div>
        <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(+e.target.value)}
          style={{ width: '100%', accentColor: 'var(--primary)', marginBottom: 10 }} />
        <div className="input-label" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700, letterSpacing: '0.5px' }}>CHI TIẾT ĐÃ HOÀN THÀNH</div>
        <textarea className="input" defaultValue={card.reportCompleted} rows={2} />
      </div>
      <div className="modal-section">
        <div className="modal-section-title">🔄 Việc Dở Dang</div>
        <textarea className="input" defaultValue={card.reportPending} rows={2} />
      </div>
      {card.reportMissingMaterials && (
        <div className="modal-section">
          <div className="modal-section-title">📦 Vật Tư Còn Thiếu</div>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {card.reportMissingMaterials.map((m, i) => (
              <div key={i} style={{ background: 'rgba(222,53,11,0.1)', border: '1px solid rgba(222,53,11,0.2)', borderRadius: 6, padding: '6px 12px', fontSize: 12, color: '#FF5630', display: 'flex', alignItems: 'center', gap: 8 }}>
                {m.name} <strong>× {m.qty}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="modal-section">
        <div className="modal-section-title">📸 Hình Ảnh Tiến Độ</div>
        <div className="attachments-grid">
          {card.attachments.slice(0, 3).map(a => (
            <img key={a.id} src={a.url} alt={a.name} className="attachment-thumb" />
          ))}
          <div className="attachment-upload">
            <span style={{ fontSize: 18 }}>📷</span>
            <span>TẢI LÊN</span>
          </div>
        </div>
      </div>
      <div className="modal-section">
        <div className="modal-section-title">⚠️ Phát Sinh</div>
        <textarea className="input" placeholder="Ghi chú các vấn đề phát sinh trong ngày..." rows={2} />
      </div>
      <div className="flex gap-2" style={{ marginTop: 20, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost" style={{ border: '1px solid var(--border)' }}>Lưu Nháp</button>
        <button className="btn btn-primary">Gửi Báo Cáo</button>
      </div>
    </div>
  );
}
