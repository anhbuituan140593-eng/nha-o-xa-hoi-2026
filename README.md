# Nhà Ở Xã Hội 2026

Website hỗ trợ kiểm tra điều kiện, chuẩn bị hồ sơ và tìm kiếm dự án nhà ở xã hội tại Việt Nam.

## Tech Stack

- **Frontend + Backend:** Next.js 15+ (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS + shadcn/ui components
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** Auth.js / NextAuth v5
- **Validation:** Zod
- **Icons:** Lucide React
- **Deploy:** Vercel

## Cài đặt

### 1. Clone & Install

```bash
npm install
```

### 2. Environment Variables

Sao chép file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Cấu hình các biến môi trường trong `.env`:

- `DATABASE_URL`: Connection string PostgreSQL (Supabase hoặc local)
- `AUTH_SECRET`: Secret key cho NextAuth (tạo bằng `openssl rand -base64 32`)
- `NEXT_PUBLIC_SITE_URL`: URL website (ví dụ: `http://localhost:3000`)
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`: Nếu dùng Supabase Storage

### 3. Database Setup

Tạo database PostgreSQL và chạy migration:

```bash
npx prisma generate
npx prisma db push
```

Hoặc dùng migration:

```bash
npx prisma migrate dev --name init
```

### 4. Seed Data

Seed dữ liệu mẫu (tỉnh thành, văn bản pháp luật, rules, dịch vụ):

```bash
npm run db:seed
```

### 5. Tạo tài khoản Admin

```bash
npm run create-admin
```

Nhập email, mật khẩu và tên khi được hỏi.

### 6. Development

```bash
npm run dev
```

Truy cập `http://localhost:3000`

### 7. Truy cập Admin Panel

Đăng nhập tại `http://localhost:3000/admin/login`

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (public)/          # Public pages
│   │   ├── page.tsx       # Homepage
│   │   ├── kiem-tra/      # Eligibility wizard
│   │   ├── ket-qua/[id]/  # Results page
│   │   ├── du-an/         # Projects list & detail
│   │   ├── dich-vu/       # Services pages
│   │   ├── dat-lich/      # Appointment booking
│   │   ├── lien-he/       # Contact page
│   │   ├── bieu-mau/      # Application forms
│   │   ├── phap-luat/     # Legal documents
│   │   ├── faq/           # FAQ
│   │   └── cam-on/        # Thank you page
│   ├── admin/             # Admin panel
│   │   ├── login/         # Login page
│   │   ├── leads/         # CRM leads
│   │   ├── appointments/  # Appointments
│   │   ├── cases/         # Client cases
│   │   ├── projects/      # Project management
│   │   ├── legal/         # Legal documents CRUD
│   │   ├── rules/         # Rules management
│   │   ├── forms/         # Forms management
│   │   └── settings/      # Settings
│   └── api/               # API routes
│       ├── auth/          # NextAuth
│       ├── eligibility/   # Eligibility check
│       ├── appointments/  # Appointment creation
│       └── leads/         # Lead creation
├── components/
│   ├── ui/                # UI primitives (Button, Card, etc.)
│   ├── eligibility/       # Wizard component
│   └── layout.tsx         # Header, Footer, Mobile CTA
└── lib/
    ├── db.ts              # Prisma client
    ├── utils.ts           # Utility functions
    ├── auth.ts            # Auth helpers
    └── eligibility/
        └── engine.ts      # Legal Rule Engine

prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Seed data script

scripts/
└── create-admin.ts        # Admin user creation script
```

## Legal Rule Engine

Hệ thống sử dụng Legal Rule Engine để đánh giá điều kiện mà không hard-code:

```typescript
// Lấy rules phù hợp
const rules = await getApplicableRules({
  applicantType,
  maritalStatus,
  province,
  checkDate: new Date(),
});

// Đánh giá
const result = evaluateEligibility(rules, applicantData);
```

Admin có thể cập nhật rules qua `/admin/rules` mà không cần sửa code.

## Các trang chính

| URL | Mô tả |
|-----|-------|
| `/` | Trang chủ |
| `/kiem-tra` | Kiểm tra điều kiện (Wizard 5 bước) |
| `/ket-qua/[id]` | Kết quả kiểm tra |
| `/du-an` | Danh sách dự án |
| `/du-an/[slug]` | Chi tiết dự án |
| `/dich-vu` | Dịch vụ hồ sơ |
| `/dich-vu/ho-so-tron-goi` | Gói trọn gói |
| `/dich-vu/ra-soat-ho-so` | Rà soát hồ sơ |
| `/dat-lich` | Đặt lịch tư vấn |
| `/lien-he` | Liên hệ |
| `/bieu-mau` | Biểu mẫu |
| `/phap-luat` | Văn bản pháp luật |
| `/faq` | Câu hỏi thường gặp |
| `/cam-on` | Trang cảm ơn |
| `/admin/login` | Đăng nhập Admin |
| `/admin` | Dashboard |

## Production Deploy

### Vercel

1. Push code lên GitHub
2. Kết nối repo với Vercel
3. Thêm environment variables trong Vercel Dashboard
4. Deploy tự động

### Supabase Database

1. Tạo project trên Supabase
2. Lấy connection string từ Settings > Database
3. Set `DATABASE_URL` trong environment variables
4. Chạy `npx prisma db push` để tạo tables

## Lưu ý quan trọng

- Website **KHÔNG** tích hợp thanh toán online
- Website **KHÔNG** bán dịch vụ tự động
- Mọi giao dịch dịch vụ diễn ra trực tiếp sau khi nhân viên liên hệ khách hàng
- Kết quả kiểm tra điều kiện chỉ mang tính tham khảo, không phải quyết định của cơ quan có thẩm quyền

## License

Private - Internal use only
