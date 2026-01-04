# Form Corso Avanzato Studio83

Form di iscrizione per il corso avanzato di estetica Studio83.

## Links

- **Form**: https://formstudio83.duckdns.org
- **Admin**: https://formstudio83.duckdns.org/admin
- **Password admin**: `studio83admin`

## Hosting

- **Server**: lap-hetzner (49.13.48.60)
- **Path**: `/root/studio83-form/`
- **Porta**: 3005
- **PM2**: `studio83-form`
- **Dominio**: formstudio83.duckdns.org (DuckDNS)

## Stack

- Next.js 15
- Tailwind CSS 4
- Database JSON (`data/submissions.json`)
- PM2 + Nginx + Let's Encrypt SSL

## Comandi utili

```bash
# Deploy aggiornamenti
ssh lap-hetzner "cd /root/studio83-form && git pull && npm run build && pm2 restart studio83-form"

# Vedere log
ssh lap-hetzner "pm2 logs studio83-form"

# Stato PM2
ssh lap-hetzner "pm2 list"

# Backup dati
ssh lap-hetzner "cat /root/studio83-form/data/submissions.json"
```

## Sezioni Form

1. Datos generales (nombre, edad)
2. Formacion y experiencia
3. Areas de interes (multiple)
4. Objetivo del curso
5. Modalidad preferida
6. Disponibilidad
7. Objetivo profesional (multiple)

## Creato

- **Data**: 4 Gennaio 2026
- **Repo**: https://github.com/Tapedynamics/studio83form
