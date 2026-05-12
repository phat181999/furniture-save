export type Priority = 'urgent' | 'high' | 'medium' | 'low';
export type CardStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
export type CardType = 'task' | 'daily_report' | 'material_request';

export interface User {
  id: string;
  name: string;
  avatar: string;
  department: string;
  role: 'admin' | 'manager' | 'staff';
}

export interface ChecklistItem {
  id: string;
  content: string;
  checked: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file';
}

export interface Activity {
  id: string;
  user: User;
  action: string;
  timestamp: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Card {
  id: string;
  listId: string;
  title: string;
  description: string;
  priority: Priority;
  status: CardStatus;
  cardType: CardType;
  assignees: User[];
  dueDate: string;
  labels: Label[];
  checklists: Checklist[];
  attachments: Attachment[];
  activities: Activity[];
  projectCode?: string;
  coverColor?: string;
  // Daily report fields
  reportProgress?: number;
  reportCompleted?: string;
  reportPending?: string;
  reportMissingMaterials?: { name: string; qty: number }[];
}

export interface List {
  id: string;
  boardId: string;
  title: string;
  color: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  description: string;
  departmentColor: string;
  emoji: string;
  memberCount: number;
  cardCount: number;
  lastUpdated: string;
  members: User[];
  lists: List[];
}

// --- USERS ---
export const USERS: User[] = [
  { id: 'u1', name: 'Thương', avatar: 'TH', department: 'Thi Công', role: 'staff' },
  { id: 'u2', name: 'Đạt', avatar: 'ĐT', department: 'Thi Công', role: 'staff' },
  { id: 'u3', name: 'Hậu', avatar: 'HU', department: 'Thi Công', role: 'staff' },
  { id: 'u4', name: 'Bằng', avatar: 'BG', department: 'Thi Công', role: 'staff' },
  { id: 'u5', name: 'Quang Toàn', avatar: 'QT', department: 'Sản Xuất', role: 'manager' },
  { id: 'u6', name: 'Lan Vương', avatar: 'LV', department: 'Kinh Doanh', role: 'staff' },
  { id: 'u7', name: 'Khánh Huyền', avatar: 'KH', department: 'Tài Chính', role: 'staff' },
  { id: 'u8', name: 'Đặng Văn Phong', avatar: 'DP', department: 'Ban Giám Đốc', role: 'admin' },
  { id: 'u9', name: 'Vũ', avatar: 'VU', department: 'Sản Xuất', role: 'staff' },
  { id: 'u10', name: 'Hồng', avatar: 'HG', department: 'Kinh Doanh', role: 'staff' },
];

// --- LABELS ---
const LABELS = {
  ct001: { id: 'lb1', name: '#CT-2026-001', color: '#0052CC' },
  ct002: { id: 'lb2', name: '#CT-2026-002', color: '#6554C0' },
  ct003: { id: 'lb3', name: '#CT-2026-003', color: '#00875A' },
  urgent: { id: 'lb4', name: 'Urgent', color: '#DE350B' },
  vattuloi: { id: 'lb5', name: 'Vật Tư Lỗi', color: '#FF8B00' },
};

// --- BOARDS ---
export const BOARDS: Board[] = [
  {
    id: 'b1',
    title: 'Phòng Sản Xuất',
    emoji: '🏭',
    description: 'Main manufacturing floor operations and assembly.',
    departmentColor: '#0052CC',
    memberCount: 6,
    cardCount: 12,
    lastUpdated: '2 giờ trước',
    members: [USERS[4], USERS[8], USERS[9]],
    lists: [
      {
        id: 'l1', boardId: 'b1', title: 'Tổ Thiết Kế 3D', color: '#0052CC',
        cards: [
          {
            id: 'c1', listId: 'l1', title: 'Thiết kế mặt bằng căn hộ 60m² - Quận 7',
            description: 'Thiết kế layout tổng thể cho căn hộ chung cư 60m². Bao gồm phòng khách, bếp, 2 phòng ngủ.',
            priority: 'high', status: 'in_progress', cardType: 'task',
            assignees: [USERS[4], USERS[8]], dueDate: '2026-05-20',
            labels: [LABELS.ct001], projectCode: '#CT-2026-001',
            checklists: [{
              id: 'cl1', title: 'Bước Thiết Kế 3D',
              items: [
                { id: 'cli1', content: 'Thiết kế mặt bằng & công năng', checked: true },
                { id: 'cli2', content: 'Thiết kế phối cảnh 3D', checked: true },
                { id: 'cli3', content: 'Thiết kế chi tiết & chốt vật liệu', checked: false },
                { id: 'cli4', content: 'Báo giá & chốt hợp đồng', checked: false },
              ]
            }],
            attachments: [
              { id: 'a1', name: 'mat-bang.png', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200', type: 'image' },
            ],
            activities: [
              { id: 'act1', user: USERS[4], action: 'đã tạo thẻ này', timestamp: '23/05 lúc 09:00' },
            ]
          },
          {
            id: 'c2', listId: 'l1', title: 'Thiết kế 3D văn phòng 120m² - Bình Thạnh',
            description: 'Phối cảnh 3D nội thất văn phòng hiện đại.',
            priority: 'medium', status: 'todo', cardType: 'task',
            assignees: [USERS[8]], dueDate: '2026-05-25',
            labels: [LABELS.ct002], projectCode: '#CT-2026-002',
            checklists: [], attachments: [],
            activities: []
          },
        ]
      },
      {
        id: 'l2', boardId: 'b1', title: 'Tổ Thiết Kế SX', color: '#6554C0',
        cards: [
          {
            id: 'c3', listId: 'l2', title: 'Bóc tách kỹ thuật tủ bếp - CT001',
            description: 'Bóc tách chi tiết kỹ thuật và phụ kiện cho bộ tủ bếp chữ L.',
            priority: 'urgent', status: 'in_progress', cardType: 'task',
            assignees: [USERS[4]], dueDate: '2026-05-15',
            labels: [LABELS.ct001, LABELS.urgent], projectCode: '#CT-2026-001',
            checklists: [{
              id: 'cl2', title: 'Bước Thiết Kế SX',
              items: [
                { id: 'cli5', content: 'Khảo sát hiện trạng trước sản xuất', checked: true },
                { id: 'cli6', content: 'Bóc tách kỹ thuật & phụ kiện', checked: true },
                { id: 'cli7', content: 'Thiết kế bản vẽ sản xuất', checked: true },
                { id: 'cli8', content: 'Chốt lại kích thước & phụ kiện với KH', checked: false },
                { id: 'cli9', content: 'Duyệt hồ sơ trước sản xuất', checked: false },
              ]
            }],
            attachments: [
              { id: 'a2', name: 'ban-ve-sx.pdf', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200', type: 'image' },
            ],
            activities: [
              { id: 'act2', user: USERS[4], action: 'đã di chuyển thẻ này từ Thiết Kế 3D sang Thiết Kế SX', timestamp: '24/05 lúc 10:45' },
            ]
          },
        ]
      },
      {
        id: 'l3', boardId: 'b1', title: 'Kế Toán Vật Tư', color: '#00875A',
        cards: [
          {
            id: 'c4', listId: 'l3', title: 'Đặt vật tư phụ kiện CT-001 còn thiếu',
            description: 'Kiểm tra tồn kho và đặt bổ sung các phụ kiện còn thiếu cho CT-001.',
            priority: 'high', status: 'in_progress', cardType: 'material_request',
            assignees: [USERS[6]], dueDate: '2026-05-14',
            labels: [LABELS.ct001, LABELS.vattuloi], projectCode: '#CT-2026-001',
            checklists: [{
              id: 'cl3', title: 'Danh Sách Vật Tư',
              items: [
                { id: 'cli10', content: 'Bản lề Blum 170° (x20)', checked: true },
                { id: 'cli11', content: 'Tay nắm âm inox (x15)', checked: false },
                { id: 'cli12', content: 'Ray trượt Hettich 500mm (x8)', checked: false },
                { id: 'cli13', content: 'Gioăng cửa PVC (5m)', checked: false },
              ]
            }],
            attachments: [],
            activities: []
          },
        ]
      },
      {
        id: 'l4', boardId: 'b1', title: 'Chờ Duyệt', color: '#FF8B00',
        cards: [
          {
            id: 'c5', listId: 'l4', title: 'Duyệt hồ sơ SX tủ giày CT-003',
            description: 'Chờ trưởng phòng duyệt bộ hồ sơ sản xuất.',
            priority: 'medium', status: 'blocked', cardType: 'task',
            assignees: [USERS[4], USERS[8]], dueDate: '2026-05-16',
            labels: [LABELS.ct003], projectCode: '#CT-2026-003',
            checklists: [], attachments: [],
            activities: []
          },
        ]
      },
    ]
  },
  {
    id: 'b2',
    title: 'Tổ Thi Công',
    emoji: '🚚',
    description: 'On-site installation logistics and field team coordination.',
    departmentColor: '#FF8B00',
    memberCount: 5,
    cardCount: 23,
    lastUpdated: '30 phút trước',
    members: [USERS[0], USERS[1], USERS[2], USERS[3]],
    lists: [
      {
        id: 'l5', boardId: 'b2', title: 'TRƯỚC KHI ĐẾN', color: '#6554C0',
        cards: [
          {
            id: 'c6', listId: 'l5', title: 'Kiểm tra vật tư #CT-2026-001',
            description: 'Kiểm tra toàn bộ vật tư, hàng hóa trước khi chất lên xe.',
            priority: 'urgent', status: 'in_progress', cardType: 'task',
            assignees: [USERS[0]], dueDate: '2026-05-13',
            labels: [LABELS.ct001, LABELS.urgent], projectCode: '#CT-2026-001',
            checklists: [{
              id: 'cl4', title: 'Checklist Trước Khi Đến',
              items: [
                { id: 'cli14', content: 'Kiểm tra file trước', checked: true },
                { id: 'cli15', content: 'Họp 5 phút đầu ngày', checked: true },
                { id: 'cli16', content: 'Soạn đồ nghề', checked: true },
                { id: 'cli17', content: 'Kiểm tra hàng tại xưởng', checked: false },
                { id: 'cli18', content: 'Vệ sinh hàng hóa trước khi đưa lên xe', checked: false },
              ]
            }],
            attachments: [
              { id: 'a3', name: 'phong-khach.jpg', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200', type: 'image' },
              { id: 'a4', name: 'tu-bep.jpg', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200', type: 'image' },
              { id: 'a5', name: 'tu-giay.jpg', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200', type: 'image' },
              { id: 'a6', name: 'noi-that.jpg', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200', type: 'image' },
            ],
            activities: [
              { id: 'act3', user: USERS[0], action: 'đã di chuyển thẻ này từ Chờ Xử Lý sang Trước Khi Đến', timestamp: '24/05 lúc 10:45' },
              { id: 'act4', user: USERS[1], action: 'đã thêm checklist Checklist Trước Khi Đến', timestamp: '24/05 lúc 11:00' },
            ]
          },
          {
            id: 'c7', listId: 'l5', title: 'Liên hệ chủ nhà chốt giờ nhận hàng',
            description: 'Xác nhận giờ đến với chủ nhà căn hộ tầng 12.',
            priority: 'high', status: 'todo', cardType: 'task',
            assignees: [USERS[1]], dueDate: '2026-05-13',
            labels: [LABELS.ct002], projectCode: '#CT-2026-002',
            checklists: [], attachments: [],
            activities: []
          },
        ]
      },
      {
        id: 'l6', boardId: 'b2', title: 'Ở CÔNG TRÌNH', color: '#FF8B00',
        cards: [
          {
            id: 'c8', listId: 'l6', title: 'Lắp modul phòng khách cần biệt thự',
            description: 'Lắp đặt hệ tủ phòng khách theo bản vẽ thiết kế mới nhất. Yêu cầu độ chính xác tuyệt đối về khoảng hở và độ phẳng của cánh tủ. Lưu ý kiểm tra hệ thống đèn LED âm tủ trước khi bắn silicone cố định.',
            priority: 'urgent', status: 'in_progress', cardType: 'task',
            assignees: [USERS[2], USERS[3]], dueDate: '2026-05-13',
            labels: [LABELS.ct001, LABELS.urgent], projectCode: '#CT-2026-001',
            checklists: [{
              id: 'cl5', title: 'Bước Thi Công',
              items: [
                { id: 'cli19', content: 'Bắn tia laser', checked: false },
                { id: 'cli20', content: 'Lắp đế tủ', checked: true },
                { id: 'cli21', content: 'Lắp thân tủ', checked: true },
                { id: 'cli22', content: 'Gắn cánh', checked: false },
                { id: 'cli23', content: 'Lắp phụ kiện & led', checked: false },
                { id: 'cli24', content: 'Kiểm tra & chỉnh cánh', checked: false },
                { id: 'cli25', content: 'Vệ sinh & đi keo', checked: false },
                { id: 'cli26', content: 'Nghiệm thu nội bộ', checked: false },
              ]
            }],
            attachments: [
              { id: 'a7', name: 'thi-cong-1.jpg', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200', type: 'image' },
              { id: 'a8', name: 'thi-cong-2.jpg', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200', type: 'image' },
              { id: 'a9', name: 'thi-cong-3.jpg', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200', type: 'image' },
            ],
            activities: [
              { id: 'act5', user: USERS[0], action: 'đã di chuyển thẻ này từ Chờ Xử Lý sang Ở Công Trình', timestamp: '24/05 lúc 10:45' },
            ]
          },
          {
            id: 'c9', listId: 'l6', title: 'Căn chỉnh cánh tủ & phụ kiện Bloom',
            description: 'Căn chỉnh lại toàn bộ cánh tủ bếp, kiểm tra bản lề Blum.',
            priority: 'medium', status: 'in_progress', cardType: 'task',
            assignees: [USERS[2]], dueDate: '2026-05-13',
            labels: [LABELS.ct001], projectCode: '#CT-2026-001',
            checklists: [], attachments: [],
            activities: []
          },
        ]
      },
      {
        id: 'l7', boardId: 'b2', title: 'BÁO CÁO', color: '#0052CC',
        cards: [
          {
            id: 'c10', listId: 'l7', title: 'Báo cáo tiến độ ngày 25/10',
            description: 'Báo cáo cuối ngày tổ thi công CT-001.',
            priority: 'high', status: 'todo', cardType: 'daily_report',
            assignees: [USERS[0]], dueDate: '2026-05-13',
            labels: [LABELS.ct001], projectCode: '#CT-2026-001',
            reportProgress: 75,
            reportCompleted: 'Đã lắp xong khung bếp dưới.',
            reportPending: 'Chưa lắp xong mặt đá và kính ốp.',
            reportMissingMaterials: [
              { name: 'Bản lề Blum', qty: 10 },
              { name: 'Tay nắm âm', qty: 5 },
            ],
            checklists: [], attachments: [
              { id: 'a10', name: 'bao-cao-1.jpg', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200', type: 'image' },
              { id: 'a11', name: 'bao-cao-2.jpg', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200', type: 'image' },
              { id: 'a12', name: 'bao-cao-3.jpg', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200', type: 'image' },
            ],
            activities: []
          },
        ]
      },
      {
        id: 'l8', boardId: 'b2', title: 'HOÀN THÀNH', color: '#36B37E',
        cards: [
          {
            id: 'c11', listId: 'l8', title: 'Nghiệm thu CT-002 tầng 5',
            description: 'Mời chủ nhà nghiệm thu toàn bộ công trình.',
            priority: 'low', status: 'done', cardType: 'task',
            assignees: [USERS[0], USERS[1]], dueDate: '2026-05-10',
            labels: [LABELS.ct002], projectCode: '#CT-2026-002',
            checklists: [], attachments: [],
            activities: []
          },
        ]
      },
    ]
  },
  {
    id: 'b3',
    title: 'Phòng Thiết Kế',
    emoji: '🎨',
    description: 'Product R&D, blueprint drafting, and material selection.',
    departmentColor: '#6554C0',
    memberCount: 4,
    cardCount: 8,
    lastUpdated: '1 giờ trước',
    members: [USERS[4], USERS[8], USERS[9]],
    lists: [
      {
        id: 'l9', boardId: 'b3', title: 'Đang Thiết Kế', color: '#6554C0',
        cards: [
          {
            id: 'c12', listId: 'l9', title: 'Phối cảnh 3D biệt thự 250m² - Thủ Đức',
            description: 'Thiết kế toàn bộ nội thất biệt thự 3 tầng.',
            priority: 'high', status: 'in_progress', cardType: 'task',
            assignees: [USERS[4]], dueDate: '2026-05-28',
            labels: [LABELS.ct003], projectCode: '#CT-2026-003',
            checklists: [], attachments: [],
            activities: []
          },
        ]
      },
      {
        id: 'l10', boardId: 'b3', title: 'Chờ Khách Duyệt', color: '#FF8B00',
        cards: [
          {
            id: 'c13', listId: 'l10', title: 'Thiết kế phòng ngủ master CT-002',
            description: 'Đang chờ phản hồi từ khách hàng.',
            priority: 'medium', status: 'blocked', cardType: 'task',
            assignees: [USERS[8]], dueDate: '2026-05-18',
            labels: [LABELS.ct002], projectCode: '#CT-2026-002',
            checklists: [], attachments: [],
            activities: []
          },
        ]
      },
    ]
  },
  {
    id: 'b4',
    title: 'Kế Toán',
    emoji: '💰',
    description: 'Financial monitoring, invoice management, and payroll.',
    departmentColor: '#36B37E',
    memberCount: 3,
    cardCount: 5,
    lastUpdated: '3 giờ trước',
    members: [USERS[6], USERS[5], USERS[7]],
    lists: [
      {
        id: 'l11', boardId: 'b4', title: 'Kế Toán Vật Tư', color: '#0052CC',
        cards: [
          {
            id: 'c14', listId: 'l11', title: 'Thanh toán NCC Blum tháng 5',
            description: 'Xử lý hóa đơn nhà cung cấp Blum.',
            priority: 'high', status: 'todo', cardType: 'task',
            assignees: [USERS[6]], dueDate: '2026-05-15',
            labels: [LABELS.ct001], projectCode: '#CT-2026-001',
            checklists: [], attachments: [],
            activities: []
          },
        ]
      },
      {
        id: 'l12', boardId: 'b4', title: 'Kế Toán Nội Bộ', color: '#6554C0',
        cards: []
      },
      {
        id: 'l13', boardId: 'b4', title: 'Kế Toán Thuế', color: '#FF8B00',
        cards: []
      },
    ]
  },
];

// Throughput chart data
export const THROUGHPUT_DATA = [
  { day: 'T2', value: 4 },
  { day: 'T3', value: 7 },
  { day: 'T4', value: 5 },
  { day: 'T5', value: 9 },
  { day: 'T6', value: 11 },
  { day: 'T7', value: 8 },
  { day: 'CN', value: 3 },
];

export const QUICK_STATS = {
  activeOrders: 142,
  activeOrdersDelta: '+15%',
  criticalOrders: 3,
  openInvoices: 8,
};

// Current user for demo
export const CURRENT_USER: User = USERS[0];
