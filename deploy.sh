#!/bin/bash
# Deploy script per lap-hetzner

# Configurazione
APP_DIR="/root/studio83-form"
REPO="https://github.com/Tapedynamics/studio83form.git"
DOMAIN="formstudio83.duckdns.org"
DUCKDNS_TOKEN="50819321-7083-4eb5-b020-a36ebad4a505"

echo "=== Deploy Form Curso Studio83 ==="

# 1. Aggiorna DuckDNS per puntare a questo server
echo "[1/6] Aggiornando DuckDNS..."
curl -s "https://www.duckdns.org/update?domains=formstudio83&token=${DUCKDNS_TOKEN}&ip=" > /dev/null
echo "DuckDNS aggiornato"

# 2. Clona o aggiorna repo
echo "[2/6] Clonando/aggiornando repository..."
if [ -d "$APP_DIR" ]; then
  cd $APP_DIR
  git pull
else
  git clone $REPO $APP_DIR
  cd $APP_DIR
fi

# 3. Installa dipendenze e builda
echo "[3/6] Installando dipendenze..."
npm install

echo "[4/6] Building..."
npm run build

# 4. Crea .env se non esiste
if [ ! -f ".env" ]; then
  echo "ADMIN_KEY=studio83admin" > .env
fi

# 5. Configura PM2
echo "[5/6] Configurando PM2..."
pm2 delete studio83-form 2>/dev/null || true
pm2 start npm --name "studio83-form" -- start
pm2 save

# 6. Configura Nginx
echo "[6/6] Configurando Nginx..."
cat > /etc/nginx/sites-available/formstudio83 << 'NGINX'
server {
    listen 80;
    server_name formstudio83.duckdns.org;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/formstudio83 /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 7. SSL con Certbot
echo "[7/7] Configurando SSL..."
certbot --nginx -d formstudio83.duckdns.org --non-interactive --agree-tos --email admin@tapedynamics.com || true

echo ""
echo "=== Deploy completato! ==="
echo "Form: https://formstudio83.duckdns.org"
echo "Admin: https://formstudio83.duckdns.org/admin"
echo ""
