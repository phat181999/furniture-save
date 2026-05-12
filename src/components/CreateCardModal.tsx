import { useState } from 'react';
import { X, Type, AlignLeft, Flag, Calendar, User, Tag, Layout } from 'lucide-react';
import { Card, List, USERS, Priority } from '../data/mockData';

interface Props {
  list: List;
  onClose: () => void;
  onAdd: (listId: string, card: Card) => void;
}

const PRIORITIES: { value: Priority; label: string; className: string }[] = [
  { value: 'low',    label: 'Low',    className: 'badge-low' },
  { value: 'medium', label: 'Medium', className: 'badge-medium' },
  { value: 'high',   label: 'High',   className: 'badge-high' },
  { value: 'urgent', label: 'Urgent', className: 'badge-urgent' },
];

const CARD_TYPES = [
  { value: 'task',             label: '📋 Task',          desc: 'A standard work item' },
  { value: 'daily_report',     label: '📊 Daily Report',  desc: 'End-of-day progress report' },
  { value: 'material_request', label: '📦 Material Req.', desc: 'Request for materials/parts' },
];

const PROJECT_CODES = ['#CT-2026-001', '#CT-2026-002', '#CT-2026-003'];

const avatarColors = ['#0052CC', '#6554C0', '#FF8B00', '#00875A', '#36B37E'];

export default function CreateCardModal({ list, onClose, onAdd }: Props) {
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority]     = useState<Priority>('medium');
  const [cardType, setCardType]     = useState('task');
  const [dueDate, setDueDate]       = useState('');
  const [selectedUsers, setUsers]   = useState<string[]>([]);
  const [projectCode, setProject]   = useState('');
  const [error, setError]           = useState('');

  const toggleUser = (id: string) =>
    setUsers(prev => prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]);

  const handleSubmit = () => {
    if (!title.trim()) { setError('Card title is required.'); return; }

    const newCard: Card = {
      id: `c_${Date.now()}`,
      listId: list.id,
      title: title.trim(),
      description,
      priority,
      status: 'todo',
      cardType: cardType as Card['cardType'],
      assignees: USERS.filter(u => selectedUsers.includes(u.id)),
      dueDate,
      labels: [],
      checklists: [],
      attachments: [],
      activities: [{ id: `act_${Date.now()}`, user: USERS[0], action: 'đã tạo thẻ này', timestamp: 'Vừa xong' }],
      projectCode: projectCode || undefined,
    };

    onAdd(list.id, newCard);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal create-modal">
        {/* Header */}
        <div className="create-modal-header">
          <div>
            <div className="create-modal-eyebrow">
              <div className="col-dot-sm" style={{ background: list.color }} />
              {list.title}
            </div>
            <h2 className="create-modal-title">Create Card</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={15} /></button>
        </div>

        <div className="create-modal-body">
          {/* Title */}
          <div className="field">
            <label className="field-label"><Type size={12} /> Title <span className="required">*</span></label>
            <input
              className={`input ${error ? 'input-error' : ''}`}
              placeholder="What needs to be done?"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            {error && <div className="field-error">{error}</div>}
          </div>

          {/* Description */}
          <div className="field">
            <label className="field-label"><AlignLeft size={12} /> Description</label>
            <textarea
              className="input"
              placeholder="Add more context..."
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Priority + Card Type row */}
          <div className="field-row">
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label"><Flag size={12} /> Priority</label>
              <div className="priority-grid">
                {PRIORITIES.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    className={`priority-btn ${priority === p.value ? 'selected' : ''}`}
                    onClick={() => setPriority(p.value)}
                  >
                    <span className={`badge ${p.className}`}>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="field" style={{ flex: 1 }}>
              <label className="field-label"><Layout size={12} /> Card Type</label>
              <div className="type-list">
                {CARD_TYPES.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    className={`type-btn ${cardType === t.value ? 'selected' : ''}`}
                    onClick={() => setCardType(t.value)}
                  >
                    <span>{t.label}</span>
                    <span className="type-desc">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date + Project Code row */}
          <div className="field-row">
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label"><Calendar size={12} /> Due Date</label>
              <input
                type="date"
                className="input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label className="field-label"><Tag size={12} /> Project Code</label>
              <select className="input" value={projectCode} onChange={e => setProject(e.target.value)}>
                <option value="">None</option>
                {PROJECT_CODES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Assignees */}
          <div className="field">
            <label className="field-label"><User size={12} /> Assign To</label>
            <div className="assignee-grid">
              {USERS.map((u, i) => {
                const selected = selectedUsers.includes(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    className={`assignee-btn ${selected ? 'selected' : ''}`}
                    onClick={() => toggleUser(u.id)}
                  >
                    <div className="avatar avatar-sm" style={{ background: avatarColors[i % avatarColors.length] }}>
                      {u.avatar}
                    </div>
                    <div className="assignee-info">
                      <div className="assignee-name">{u.name}</div>
                      <div className="assignee-dept">{u.department}</div>
                    </div>
                    {selected && <div className="check-mark">✓</div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="create-modal-footer">
          <button className="btn btn-ghost" style={{ border: '1px solid var(--border)' }} onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={!title.trim()}>
            Create Card
          </button>
        </div>
      </div>

      <style>{`
        .create-modal { max-width: 640px; padding: 0; }
        .create-modal-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid var(--border);
        }
        .create-modal-eyebrow {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.6px;
          color: var(--text-muted); margin-bottom: 4px; text-transform: uppercase;
        }
        .col-dot-sm { width: 7px; height: 7px; border-radius: 50%; }
        .create-modal-title { font-size: 18px; font-weight: 700; color: var(--text-heading); }
        .modal-close-btn {
          width: 28px; height: 28px; border-radius: 6px; flex-shrink: 0;
          border: none; background: var(--surface-2); color: var(--text-muted);
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .modal-close-btn:hover { background: var(--surface-3); color: var(--text-heading); }

        .create-modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }

        .field { display: flex; flex-direction: column; gap: 6px; }
        .field-row { display: flex; gap: 16px; }
        .field-label {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
          color: var(--text-muted); text-transform: uppercase;
        }
        .required { color: var(--danger); }
        .field-error { font-size: 12px; color: var(--danger); margin-top: 2px; }
        .input-error { border-color: var(--danger) !important; }

        select.input { cursor: pointer; }
        select.input option { background: var(--surface-2); }

        /* Priority */
        .priority-grid { display: flex; gap: 6px; flex-wrap: wrap; }
        .priority-btn {
          padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border);
          background: transparent; cursor: pointer; transition: all 0.15s;
        }
        .priority-btn.selected { border-color: rgba(166,197,226,0.4); background: var(--surface-2); }
        .priority-btn:hover { background: var(--surface-2); }

        /* Card type */
        .type-list { display: flex; flex-direction: column; gap: 4px; }
        .type-btn {
          display: flex; align-items: center; justify-content: space-between;
          padding: 7px 10px; border-radius: 6px;
          border: 1px solid var(--border); background: transparent;
          cursor: pointer; font-size: 12px; color: var(--text-heading);
          transition: all 0.15s; text-align: left;
        }
        .type-btn.selected { border-color: var(--primary); background: rgba(0,82,204,0.12); }
        .type-btn:hover:not(.selected) { background: var(--surface-2); }
        .type-desc { font-size: 10px; color: var(--text-muted); }

        /* Assignees */
        .assignee-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; max-height: 180px; overflow-y: auto; padding-right: 4px; }
        .assignee-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 6px;
          border: 1px solid var(--border); background: transparent;
          cursor: pointer; transition: all 0.15s; text-align: left; position: relative;
        }
        .assignee-btn.selected { border-color: var(--secondary); background: rgba(54,179,126,0.1); }
        .assignee-btn:hover:not(.selected) { background: var(--surface-2); }
        .assignee-info { flex: 1; min-width: 0; }
        .assignee-name { font-size: 12px; font-weight: 600; color: var(--text-heading); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .assignee-dept { font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .check-mark { font-size: 11px; color: var(--secondary); font-weight: 700; flex-shrink: 0; }

        /* Footer */
        .create-modal-footer {
          display: flex; align-items: center; justify-content: flex-end; gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid var(--border);
        }
        .btn:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
