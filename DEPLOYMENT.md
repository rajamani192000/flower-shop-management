# Firebase Production Deployment (Angular + Functions + Firestore)

## 1. One-time Setup

```bash
firebase login
firebase use --add
firebase init hosting functions firestore
```

Choose:
- Hosting: `dist/flower-shop-management/browser`
- Functions source: `functions`
- SPA rewrite: **Yes**
- Firestore rules file: `firestore.rules`

## 2. Environment Setup

### Frontend
- `src/environments/environment.ts` -> local API: `http://localhost:5000/api`
- `src/environments/environment.prod.ts` -> production API: `/api`

### Functions Secrets / Variables
Set in CI/CD or local shell:
- `FIREBASE_API_KEY`
- `FIREBASE_STORAGE_BUCKET`
- `FUNCTION_REGION` (default `us-central1`)

## 3. Local Build + Deploy

```bash
# frontend
npm ci
npm run build -- --configuration production

# functions
cd functions
npm ci
cd ..

# deploy
firebase deploy --only hosting,functions,firestore:rules --project your-production-project-id
```

## 4. Staging vs Production

Aliases are defined in `.firebaserc`:
- `staging`
- `production`

Commands:

```bash
firebase deploy --only hosting,functions,firestore:rules --project staging
firebase deploy --only hosting,functions,firestore:rules --project production
```

## 5. GitHub Actions Secrets

Set these repository secrets:
- `FIREBASE_TOKEN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_API_KEY`
- `FIREBASE_STORAGE_BUCKET`

Workflow file:
- `.github/workflows/deploy.yml`

## 6. Custom Domain

1. Firebase Console -> Hosting -> Add custom domain
2. Add DNS records at registrar
3. Wait for SSL provisioning
4. Validate HTTPS and redirect behavior

## 7. Monitoring and Logs

- Functions logs: Firebase Console -> Functions -> Logs
- Firestore usage: Firebase Console -> Firestore -> Usage
- Alerts: Google Cloud Monitoring -> create error-rate + latency alerts

## 8. Performance Notes

- Firebase Hosting serves compressed assets automatically (gzip/brotli).
- Immutable cache headers are set in `firebase.json`.
- Angular lazy modules remain enabled.
- API and SPA are same-origin in production (`/api`) for low latency and no CORS preflight overhead in common paths.

