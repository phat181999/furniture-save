import './board.css';
import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners, DragStartEvent, DragOverEvent, DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, UserPlus, Filter, ChevronLeft, Paperclip, CheckSquare, Calendar, GripVertical } from 'lucide-react';
import { BOARDS, Card, List } from '../data/mockData';
import CardModal from '../components/CardModal';
import CreateCardModal from '../components/CreateCardModal';
import Topbar from '../components/Topbar';

const avatarColors = ['#0052CC', '#6554C0', '#FF8B00', '#00875A', '#36B37E'];

function priorityClass(p: string) {
  return { urgent: 'badge-urgent', high: 'badge-high', medium: 'badge-medium', low: 'badge-low' }[p] || 'badge-low';
}
function cardTypeIcon(t: string) {
  if (t === 'daily_report') return '📊';
  if (t === 'material_request') return '📦';
  return '📋';
}

/* ─── Sortable Card ──────────────────────────────────────────── */
function SortableCard({
  card, onClick,
}: { card: Card; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: localDragging } =
    useSortable({ id: card.id, data: { type: 'card', card } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: localDragging ? 0.35 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardItem card={card} onClick={onClick} />
    </div>
  );
}

/* ─── Card Item (pure UI) ────────────────────────────────────── */
function CardItem({
  card, onClick, ghost = false,
}: { card: Card; onClick?: () => void; ghost?: boolean }) {
  const checklist = card.checklists[0];
  const checkedCount = checklist ? checklist.items.filter(i => i.checked).length : 0;
  const totalCount = checklist ? checklist.items.length : 0;

  return (
    <div
      className={`kanban-card priority-${card.priority} ${ghost ? 'card-ghost' : ''}`}
      onClick={onClick}
    >
      {/* Grip indicator — visual only, whole card is draggable */}
      <div className="card-drag-handle">
        <GripVertical size={12} />
      </div>

      <div className="card-header-row">
        <span className="card-type-icon">{cardTypeIcon(card.cardType)}</span>
        {card.status === 'done' && <span className="badge badge-done" style={{ fontSize: 10 }}>Done</span>}
      </div>

      <div className="card-title">{card.title}</div>

      {/* Labels */}
      <div className="card-labels">
        {card.projectCode && (
          <span className="label-chip" style={{ background: 'rgba(0,82,204,0.2)', color: '#4C9AFF', border: '1px solid rgba(0,82,204,0.3)', fontSize: 10 }}>
            {card.projectCode}
          </span>
        )}
        <span className={`badge ${priorityClass(card.priority)}`} style={{ fontSize: 10 }}>
          {card.priority.toUpperCase()}
        </span>
      </div>

      {/* Checklist progress */}
      {checklist && totalCount > 0 && (
        <div style={{ marginTop: 8 }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.round((checkedCount / totalCount) * 100)}%` }} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="card-footer">
        <div className="avatar-stack">
          {card.assignees.slice(0, 2).map((u, i) => (
            <div key={u.id} className="avatar avatar-sm" style={{ background: avatarColors[i % avatarColors.length] }}>
              {u.avatar}
            </div>
          ))}
        </div>
        <div className="card-meta">
          {card.dueDate && (
            <span className="card-meta-item">
              <Calendar size={10} />
              {new Date(card.dueDate).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' })}
            </span>
          )}
          {checklist && totalCount > 0 && (
            <span className="card-meta-item">
              <CheckSquare size={10} /> {checkedCount}/{totalCount}
            </span>
          )}
          {card.attachments.length > 0 && (
            <span className="card-meta-item"><Paperclip size={10} />{card.attachments.length}</span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Droppable Column ───────────────────────────────────────── */
function DroppableColumn({
  list, onCardClick, onAddCard,
}: { list: List; onCardClick: (card: Card) => void; onAddCard: (list: List) => void }) {
  const cardIds = list.cards.map(c => c.id);

  return (
    <div className="kanban-col">
      <div className="col-header">
        <div className="col-title-row">
          <div className="col-dot" style={{ background: list.color }} />
          <span className="col-title">{list.title}</span>
          <span className="col-count">{list.cards.length}</span>
        </div>
        <button className="icon-btn-sm" onClick={() => onAddCard(list)}><Plus size={14} /></button>
      </div>

      <div className="col-cards">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {list.cards.map(card => (
            <SortableCard key={card.id} card={card} onClick={() => onCardClick(card)} />
          ))}
        </SortableContext>
        <button className="add-card-btn" onClick={() => onAddCard(list)}>
          <Plus size={13} /> Add a card
        </button>
      </div>
    </div>
  );
}

/* ─── Board View (main) ──────────────────────────────────────── */
export default function BoardView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const board = BOARDS.find(b => b.id === id);

  // Local state — clone lists so DnD mutations stay in-memory
  const [lists, setLists] = useState<List[]>(() =>
    board ? board.lists.map(l => ({ ...l, cards: [...l.cards] })) : []
  );
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeCard, setActiveCard]     = useState<Card | null>(null);
  const [creatingIn, setCreatingIn]     = useState<List | null>(null);

  /* Add a new card to the top of the list */
  const handleAddCard = (listId: string, card: Card) =>
    setLists(prev => prev.map(l =>
      l.id === listId ? { ...l, cards: [card, ...l.cards] } : l
    ));

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  /* Find which list a card belongs to */
  const findList = useCallback((cardId: string) =>
    lists.find(l => l.cards.some(c => c.id === cardId)), [lists]);

  const findListById = useCallback((listId: string) =>
    lists.find(l => l.id === listId), [lists]);

  /* ── Drag Start ── */
  const handleDragStart = ({ active }: DragStartEvent) => {
    const card = lists.flatMap(l => l.cards).find(c => c.id === active.id);
    setActiveCard(card ?? null);
  };

  /* ── Drag Over (cross-column preview) ── */
  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);
    if (activeId === overId) return;

    const srcList = findList(activeId);
    // 'over' can be a card id OR a list id
    const dstList = findList(overId) ?? findListById(overId);
    if (!srcList || !dstList || srcList.id === dstList.id) return;

    setLists(prev => {
      const next = prev.map(l => ({ ...l, cards: [...l.cards] }));
      const src = next.find(l => l.id === srcList.id)!;
      const dst = next.find(l => l.id === dstList.id)!;

      const cardIdx = src.cards.findIndex(c => c.id === activeId);
      const [card] = src.cards.splice(cardIdx, 1);
      card.listId = dstList.id;

      const overIdx = dst.cards.findIndex(c => c.id === overId);
      if (overIdx >= 0) {
        dst.cards.splice(overIdx, 0, card);
      } else {
        dst.cards.push(card);
      }
      return next;
    });
  };

  /* ── Drag End (same-column sort) ── */
  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null);
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const list = findList(activeId);
    if (!list) return;

    const overInSameList = list.cards.some(c => c.id === overId);
    if (!overInSameList) return;

    setLists(prev => prev.map(l => {
      if (l.id !== list.id) return l;
      const oldIdx = l.cards.findIndex(c => c.id === activeId);
      const newIdx = l.cards.findIndex(c => c.id === overId);
      return { ...l, cards: arrayMove(l.cards, oldIdx, newIdx) };
    }));
  };

  if (!board) return (
    <div className="page" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
      Board not found. <button className="btn btn-ghost" onClick={() => navigate('/')}>Go back</button>
    </div>
  );

  return (
    <div className="page">
      <Topbar />
      <div className="board-page">
        {/* Header */}
        <div className="board-header">
          <div className="board-header-left">
            <button className="icon-btn-sm" onClick={() => navigate('/')}><ChevronLeft size={16} /></button>
            <div className="board-dot-lg" style={{ background: board.departmentColor }} />
            <div>
              <div className="board-page-title">{board.emoji} {board.title.toUpperCase()}</div>
              <div className="board-page-sub">PRODUCTION PIPELINE</div>
            </div>
          </div>
          <div className="board-header-right">
            <div className="avatar-stack">
              {board.members.slice(0, 4).map((m, i) => (
                <div key={m.id} className="avatar" style={{ background: avatarColors[i % avatarColors.length] }}>{m.avatar}</div>
              ))}
              {board.memberCount > 4 && (
                <div className="avatar" style={{ background: 'var(--surface-3)' }}>+{board.memberCount - 4}</div>
              )}
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 12, border: '1px solid var(--border)' }}>
              <UserPlus size={13} /> Add Member
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="board-filters">
          {['Priority', 'Assignee', 'Label', 'Date'].map(f => (
            <button key={f} className="filter-btn"><Filter size={11} /> {f} ▾</button>
          ))}
          <button className="filter-btn" style={{ marginLeft: 4 }}>More Filters</button>
        </div>

        {/* Kanban with DnD */}
        <div className="kanban-scroll">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="kanban-board">
              {lists.map(list => (
                <DroppableColumn
                  key={list.id}
                  list={list}
                  onCardClick={setSelectedCard}
                  onAddCard={setCreatingIn}
                />
              ))}
              <div className="add-list-col">
                <button className="add-list-btn"><Plus size={14} /> Add another list</button>
              </div>
            </div>

            {/* Drag Overlay — floating ghost card */}
            <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18,0.67,0.6,1.22)' }}>
              {activeCard && <CardItem card={activeCard} ghost />}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {selectedCard && <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />}
      {creatingIn && (
        <CreateCardModal
          list={creatingIn}
          onClose={() => setCreatingIn(null)}
          onAdd={handleAddCard}
        />
      )}
    </div>
  );
}
