# **Sinthia Kitchen Shop – Web**

## **Modern Kitchen E-Commerce Platform**

**Sinthia Kitchen Shop** is a full-featured web-based e-commerce platform built for managing and selling kitchen products. It includes product management, order handling, secure authentication, banner/settings management, and an admin dashboard for full control of the shop. The website ensures a smooth shopping experience with category browsing, responsive UI, and a modern MERN-based workflow.

---

### **Features**

- **Product Browsing:** Customers can explore kitchen items with category-wise filtering.
- **Secure Authentication:** Login, registration, and protected routes with JWT.
- **Cart System:** Add-to-cart, remove-from-cart, and checkout handling.
- **Order Management:** Track all customer orders from the admin panel.
- **Admin Dashboard:**

  - Add / Update / Delete products
  - Manage banners
  - Manage shop settings (categories, sliders)

- **Analytics:** Daily order stats visualized with charts.
- **Responsive UI:** Fully mobile-friendly and smooth UX.
- **Notifications:** Toast and modal-based alerts for actions and errors.

---

### **Technologies Used**

- **Frontend:** React.js, Tailwind CSS, MUI, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Firebase, JWT (JSON Web Token)
- **Image Hosting:** Cloudinary, ImgBB
- **State/Data:** TanStack Query (React Query)
- **Deployment:** Netlify / Vercel

---

## **Dev Dependencies**

```json
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@mui/material": "^7.3.1",
    "@tailwindcss/vite": "^4.1.11",
    "@tanstack/react-query": "^5.85.0",
    "@tanstack/react-table": "^8.21.3",
    "animate.css": "^4.1.1",
    "aos": "^2.3.4",
    "axios": "^1.11.0",
    "dotenv": "^17.2.1",
    "firebase": "^12.1.0",
    "jspdf": "^3.0.2",
    "jspdf-autotable": "^5.0.2",
    "prop-types": "^15.8.1",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-head": "^3.4.2",
    "react-icons": "^5.5.0",
    "react-router": "^7.8.1",
    "react-scroll-to-top": "^3.1.0",
    "react-simple-typewriter": "^5.0.1",
    "react-spinners": "^0.17.0",
    "react-toastify": "^11.0.5",
    "react-tooltip": "^5.29.1",
    "recharts": "^3.1.2",
    "sweetalert2": "^11.22.3",
    "swiper": "^11.2.10",
    "tailwindcss": "^4.1.11"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "eslint": "^9.33.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "vite": "^7.1.2"
  }
```

---

# ⚙️ **Installation Guide (Client + Server)**

## **🖥️ 1) Clone the Repositories**

### **Client**

```bash
git clone https://github.com/mrirakib04/sinthia-kitchen-web
cd sinthia-kitchen-web
```

### **Server**

```bash
git clone https://github.com/mrirakib04/sinthia-kitchen-server
cd sinthia-kitchen-server
```

---

## **📌 2) Install Dependencies**

### Client

```bash
npm install
```

### Server

```bash
npm install
```

---

## **🔐 3) Create Environment Variables**

### **Client → `.env`**

```
VITE_BASE_URL=http://localhost:5500
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### **Server → `.env`**

```
PORT=5500
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## **▶️ 4) Run the Server**

```bash
npm run start
```

---

## **▶️ 5) Run the Client**

```bash
npm run dev
```

---

## **Live Site Link**

- [https://sinthia-kitchen-shop.netlify.app/](https://sinthia-kitchen-shop.netlify.app/)

## **Client Repository**

- [https://github.com/mrirakib04/sinthia-kitchen-web](https://github.com/mrirakib04/sinthia-kitchen-web)

## **Server Repository**

- [https://github.com/mrirakib04/sinthia-kitchen-server](https://github.com/mrirakib04/sinthia-kitchen-server)

---

## 📌 Conclusion

Thank you for exploring **SKS Web**!  
Your feedback and suggestions are always welcome.

---

Developed by **Md Rakibul Islam Rakib**  
✨ Design: **Own Idea**
