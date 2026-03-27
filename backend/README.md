# Flower Shop Backend (Express + Firebase Admin)

## Prerequisites
- Node.js 18+
- Firebase service account JSON file

## Setup
1. Copy `.env.example` to `.env`
2. Set `FIREBASE_API_KEY` (Web API key)
3. Set `FIREBASE_SERVICE_ACCOUNT_PATH` to your service account JSON file path
4. Run:
   - `npm install`
   - `npm run dev`

## APIs
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `POST /api/admin/initialize`
- `POST /api/common/create`
- `GET /api/common/list?collection=flowers`
- `PUT /api/common/update`
- `DELETE /api/common/delete?collection=flowers&id=<docId>`
- `POST /api/sales/create`
- `POST /api/purchase/create`
- `POST /api/expense/create`
- `POST /api/waste/create`
- `GET /api/stock/status`
- `POST /api/upload`
