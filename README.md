# 🐾 PetConnect

> A comprehensive platform for pet and street animal welfare - Connecting communities to save lives, one paw at a time.

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-orange)](https://bun.sh/)

## 🌟 Features

### 🚨 Real-Time Rescue Map
- Report injured street animals with location
- Interactive map with OpenStreetMap
- Status tracking (Open, Accepted, In Progress, Resolved)
- Nearby volunteer alerts

### 🏥 Nearby Services Locator
- Find vets, clinics, groomers, trainers
- Filter by service type
- Distance calculation
- Contact and navigation

### 🐾 Lost & Found Pets
- Report lost or found pets
- Image upload with Cloudinary
- Filter by status and type
- Contact owners directly

### ❤️ Adoption Network
- Browse pets available for adoption
- NGOs can create listings
- Apply to adopt
- Filter by species

### 🛒 Pet Store
- Browse pet products by category
- Search functionality
- Shopping cart
- Order management
- Discount pricing

### 👤 User Profiles
- Role-based accounts (Pet Owner, NGO, Vet, Volunteer, Service Provider)
- Profile management
- Order history
- Volunteer stats

## 🚀 Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v7
- **Maps:** Leaflet + react-leaflet
- **HTTP Client:** Axios
- **Styling:** Custom CSS

### Backend
- **Runtime:** Bun
- **Framework:** Express
- **Database:** MongoDB Atlas
- **Authentication:** JWT + bcryptjs
- **Image Storage:** Cloudinary
- **ODM:** Mongoose

## 📦 Installation

### Prerequisites
- [Bun](https://bun.sh/) installed
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/DEBA2003-BYTE/Pet-Connect.git
cd Pet-Connect
```

### 2. Backend Setup
```bash
cd backend
bun install

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

### 3. Frontend Setup
```bash
cd frontend
bun install
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
bun run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
bun run dev
```

### 5. Access the Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5001

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/petconnect
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 📱 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| Authentication | ✅ | JWT-based auth with roles |
| Rescue Map | ✅ | Report & track injured animals |
| Services Locator | ✅ | Find nearby pet services |
| Lost & Found | ✅ | Report lost/found pets |
| Adoptions | ✅ | Browse & apply for adoption |
| Pet Store | ✅ | E-commerce for pet products |
| Image Upload | ✅ | Cloudinary integration |
| Community Forum | 🚧 | Coming soon |
| Events | 🚧 | Coming soon |
| Health Records | 🚧 | Coming soon |

## 🗂️ Project Structure

```
PetConnect/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth middleware
│   │   ├── utils/           # Utilities
│   │   ├── config/          # Configuration
│   │   └── server.ts        # Express server
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── routes/          # Page components
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context
│   │   ├── services/        # API client
│   │   └── App.tsx
│   ├── vite.config.ts
│   └── package.json
│
├── docs/                    # Documentation
├── .gitignore
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user

### Rescues
- `POST /api/rescues` - Create rescue report
- `GET /api/rescues/nearby` - Get nearby rescues
- `PATCH /api/rescues/:id` - Update rescue status

### Services
- `GET /api/services/nearby` - Find nearby services

### Lost & Found
- `POST /api/lost-found` - Report lost/found pet
- `GET /api/lost-found` - List all reports

### Adoptions
- `POST /api/adoptions` - Create adoption listing
- `GET /api/adoptions` - Browse adoptions
- `POST /api/adoptions/:id/apply` - Apply to adopt

### Store
- `GET /api/store/products` - List products
- `POST /api/store/cart/add` - Add to cart
- `POST /api/store/orders` - Create order

## 🚀 Deployment

### Deploy to Vercel (Frontend)
```bash
cd frontend
vercel
```

### Deploy to Render (Backend)
1. Connect GitHub repository
2. Select `backend` folder
3. Add environment variables
4. Deploy

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Debarghya Pramanik**
- GitHub: [@DEBA2003-BYTE](https://github.com/DEBA2003-BYTE)

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Cloudinary for image hosting
- MongoDB Atlas for database hosting
- All contributors and supporters

## 📞 Support

For support, open an issue on GitHub.

---

Made with ❤️ for pets and street animals in India
