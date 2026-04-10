# 🛒 Vigo Store

Full-stack e-commerce application built with **Nuxt 3**, **Prisma 6.x**, **PostgreSQL**, and **Docker**.

## ✨ Features

- 🔐 JWT Authentication (Register/Login)
- 🛍️ Product catalog with search & filters
- 🛒 Shopping cart with Pinia state management
- 📦 Order management system
- 👑 Admin dashboard for products, orders & users
- 🐳 Dockerized PostgreSQL database
- 📱 Responsive TailwindCSS UI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone & Install

```bash
git clone https://github.com/puplicHost/Vigo-store-v2.git
cd Vigo-store-v2
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env if needed (defaults work with Docker)
```

### 3. Start Database

```bash
docker-compose up -d postgres
```

### 4. Database Setup

```bash
npm run db:migrate
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

**Open:** http://localhost:3000

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@vigo.com` | `admin123` |

## 📁 Project Structure

```
vigo-store/
├── app/
│   ├── components/      # Vue components
│   ├── composables/     # Vue composables
│   ├── layouts/         # Nuxt layouts
│   ├── pages/           # Application pages
│   └── stores/          # Pinia stores
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── server/
│   ├── api/             # API routes
│   ├── middleware/      # Auth & admin middleware
│   └── utils/           # Server utilities
├── docker-compose.yml   # Docker config
└── package.json
```

## 🔌 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/products` | List products |
| GET | `/api/products/[id]` | Single product |
| GET | `/api/categories` | List categories |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

### Protected (JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/orders` | User orders |
| POST | `/api/orders` | Create order |

### Admin (JWT + Admin Role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET/POST | `/api/admin/products` | Product CRUD |
| GET/PATCH | `/api/admin/orders` | Order management |
| GET | `/api/admin/users` | User list |

## 🧪 Testing

Use the included Postman collection:

```bash
# Import in Postman
vigo-store.postman_collection.json
```

Or test with curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vigo.com","password":"admin123"}'
```

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

## 🐳 Docker Commands

```bash
# Start database
docker-compose up -d postgres

# Stop database
docker-compose down

# View logs
docker-compose logs -f postgres
```

## 🛠️ Tech Stack

- **Frontend:** Nuxt 3, Vue 3, TailwindCSS
- **State:** Pinia
- **Backend:** Nitro (Nuxt Server)
- **Database:** PostgreSQL 16
- **ORM:** Prisma 6.x
- **Auth:** JWT + bcrypt
- **Container:** Docker Compose

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

Built with ❤️ following the Vigo Store Project Plan
