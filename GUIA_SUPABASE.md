# GUÍA 1 — Crear la base de datos en Supabase

## Paso 1: Crear cuenta

1. Ve a **https://supabase.com**
2. Clic en **"Start your project"** o **"Sign in"**
3. Puedes entrar con tu cuenta de **GitHub** (más rápido) o con email

## Paso 2: Crear el proyecto

1. Clic en **"New project"**
2. Rellena el formulario:
   - **Name:** `siped`
   - **Database Password:** crea una contraseña (anótala)
   - **Region:** elige la más cercana (p.ej. **South America (São Paulo)** para Perú)
   - **Plan:** Free (gratis, es el predeterminado)
3. Clic en **"Create new project"**
4. Espera 1-2 minutos mientras se crea

## Paso 3: Copiar la connection string

1. En el menú lateral, ve a **Settings** (el engranaje, abajo a la izquierda)
2. Clic en **"Database"**
3. Busca la sección **"Connection string"**
4. Verás algo como:
   ```
   postgresql://postgres.xxxxx:TU_PASSWORD@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
   ```
5. **IMPORTANTE:** reemplaza `[YOUR-PASSWORD]` por la contraseña que pusiste en el Paso 2
6. Copia la cadena completa

## Paso 4: Configurar la conexión de Vercel (necesaria para despliegue)

> **NOTA IMPORTANTE:** Cuando la pegues en Vercel, usa la cadena **"Transaction"** (pooler). Y para que Prisma funcione bien con el pooler de Supabase, si te da error de `pgbouncer`, al final de la URL agrega `?pgbouncer=true&connection_limit=1` o usa la URL directa (sin pooler) que viene en **"Session pooler"** o la opción **"Direct connection"**.

Estructura final que debe tener en Vercel:
```
DATABASE_URL=postgresql://postgres.xxxxx:TU_PASSWORD@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
```

## Paso 5 (recomendado): Crear la base de datos local de prueba

Antes de ir a Vercel, puedes probar que todo funciona en tu PC:

1. Abre tu terminal en `C:\xampp\htdocs\proyecto\siped`
2. En el archivo `.env`, reemplaza la línea de DATABASE_URL con tu nueva cadena de Supabase
3. Ejecuta:
   ```
   npx prisma db push
   ```
   Esto crea las tablas en Supabase
4. Ejecuta:
   ```
   npx prisma db seed
   ```
   Esto crea los usuarios de prueba
5. Verifica con:
   ```
   npm run dev
   ```
   y entra a http://localhost:3000 con `admin@siped.com` / `admin123`

## Resumen de datos que necesitas guardar

| Dato | Dónde lo encuentras |
|------|---------------------|
| DATABASE_URL | Supabase → Settings → Database → Connection string |
| Database Password | La que creaste en el Paso 2 |

## Si algo falla

- **Error de `pgbouncer`:** agrega `?pgbouncer=true&connection_limit=1` al final de la URL
- **No conecta:** usa la cadena **"Direct connection"** de Supabase en vez del pooler
- **Timeout:** verifica que la contraseña no tenga caracteres especiales que rompan la URL (si tiene `@`, `:`, `#`, cámbiala por una simple)
