# GUÍA DE CONFIGURACIÓN — SIPED

## 1. OPENAI_API_KEY (Autollenado con IA)

1. Ve a https://platform.openai.com/api-keys
2. Inicia sesión o crea una cuenta
3. Haz clic en **"+ Create new secret key"**
4. Copia la clave y pégala en `.env` como:
   ```
   OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
   ```
5. Opcional: cambia el modelo en `src/app/api/ai/autofill/route.ts` línea 48 (por defecto usa `gpt-4o-mini`)

**Alternativa gratuita — DeepSeek:**
- Ve a https://platform.deepseek.com/api_keys
- Crea una API key
- En `.env` escribe:
  ```
  DEEPSEEK_API_KEY=sk-xxxxxxxxxxxx
  ```
- Si usas DeepSeek, **no** necesitas `OPENAI_API_KEY`

---

## 2. GOOGLE_DRIVE_CLIENT_ID / SECRET (Google Drive)

1. Ve a https://console.cloud.google.com/
2. Crea un proyecto nuevo o selecciona uno existente
3. Ve a **APIs & Services > Library**
4. Busca **"Google Drive API"** y actívala
5. Ve a **APIs & Services > Credentials**
6. Haz clic en **"+ Create Credentials" > "OAuth client ID"**
7. Application type: **"Web application"**
8. En **Authorized redirect URIs** agrega:
   ```
   http://localhost:3000/api/drive/auth/callback
   https://tudominio.com/api/drive/auth/callback (cuando esté en producción)
   ```
9. Copia **Client ID** y **Client Secret** al `.env`:
   ```
   GOOGLE_DRIVE_CLIENT_ID=xxxxx.apps.googleusercontent.com
   GOOGLE_DRIVE_CLIENT_SECRET=GOCSPX-xxxxxxxx
   ```

---

## 3. STRIPE (Pagos)

1. Ve a https://dashboard.stripe.com/register (o login)
2. Activa tu cuenta y ve al **Dashboard**
3. Ve a **Developers > API keys**
4. Copia la **Secret key** (sk_live_xxx o sk_test_xxx) y pégala en `.env`:
   ```
   STRIPE_SECRET_KEY=sk_live_xxxxxxxxx
   ```
5. Para los **Price IDs** (planes):
   - Ve a **Products > Add Product**
   - Crea un producto "Plan Semanal SIPED" (S/ 10 recurrente semanal)
   - Crea un producto "Plan Mensual SIPED" (S/ 30 recurrente mensual)
   - Copia el **Price ID** de cada uno (empieza con `price_xxx`)
   ```
   STRIPE_PRICE_WEEKLY=price_xxxxx
   STRIPE_PRICE_MONTHLY=price_xxxxx
   ```
6. Para el webhook:
   - Ve a **Developers > Webhooks > Add endpoint**
   - URL: `https://tudominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `customer.subscription.updated`
   - Copia el **Signing secret**:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```
7. En desarrollo, usa **Stripe CLI** para forwardear webhooks:
   ```
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

---

## 4. AUTH_SECRET / AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET (Autenticación)

**AUTH_SECRET** — llave para firmar sesiones JWT:
```
npx auth secret
```
O genera una manualmente con Node.js:
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Google OAuth (login con Google):**
1. Ve a https://console.cloud.google.com/
2. APIs & Services > Credentials > Create OAuth client ID
3. Authorized redirect URIs agrega:
   ```
   http://localhost:3000/api/auth/callback/google
   https://tudominio.com/api/auth/callback/google
   ```
4. Copia al `.env`:
   ```
   AUTH_GOOGLE_ID=xxxxx.apps.googleusercontent.com
   AUTH_GOOGLE_SECRET=GOCSPX-xxxxxx
   ```

---

## 5. NEXT_PUBLIC_APP_URL

En `.env`:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
Cuando esté en producción, cámbialo a tu dominio real.

---

## Archivo `.env` completo de ejemplo

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Autenticación
AUTH_SECRET=tu-secreto-generado-aqui
AUTH_GOOGLE_ID=xxxxx.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-xxxxx

# URL de la app
NEXT_PUBLIC_APP_URL=http://localhost:3000

# IA (elige una)
OPENAI_API_KEY=sk-proj-xxxxx
# DEEPSEEK_API_KEY=sk-xxxxx

# Google Drive (opcional)
GOOGLE_DRIVE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_DRIVE_CLIENT_SECRET=GOCSPX-xxxxx

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PRICE_WEEKLY=price_xxxxx
STRIPE_PRICE_MONTHLY=price_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## Resumen de URLs de cada servicio

| Servicio | URL para obtener las credenciales |
|----------|-----------------------------------|
| OpenAI | https://platform.openai.com/api-keys |
| DeepSeek | https://platform.deepseek.com/api_keys |
| Google Cloud (Drive + Auth) | https://console.cloud.google.com/ |
| Stripe | https://dashboard.stripe.com/ |
| Generar AUTH_SECRET | `npx auth secret` en terminal |

¿Necesitas ayuda mañana con algún paso en específico?
