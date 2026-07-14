# todo-list-manager-laravel

Un gestore di todo list ispirato a Google Keep, costruito con Laravel: crea task, collega ad ognuna delle note con uno stato, e gestiscile da un'interfaccia web statica.

## Struttura del progetto

```
todo-list-manager-laravel/
├── frontend/                  # pagina statica HTML/CSS/JS che consuma l'API
│   ├── index.html
│   ├── main.js
│   ├── api.js
│   └── index.css
└── laravel-backend/
    ├── docker-compose.yml     # orchestrazione Docker (PHP, MySQL, phpMyAdmin)
    ├── php/Dockerfile
    ├── .env.docker            # env di riferimento per l'uso con Docker
    ├── .env.laravel           # solo credenziali DB per Docker
    └── app/                   # progetto Laravel vero e proprio (composer.json qui!)
```

Il backend Laravel **non è nella root del repository**: si trova in `laravel-backend/app/`. Tutti i comandi `composer`/`artisan` vanno lanciati da lì.

## Requisiti

- PHP 8.3+
- Composer
- Docker e Docker Compose (opzionale ma consigliato) **oppure** MySQL/MariaDB installato in locale
- Un browser (il frontend non richiede Node/npm per funzionare: è HTML/CSS/JS puro)

## Avvio con Docker (consigliato)

`laravel-backend/docker-compose.yml` avvia il backend PHP, un database MySQL e phpMyAdmin.

```bash
cd laravel-backend
docker compose up -d --build
```

Al primo avvio, dentro il container va comunque generata la key ed eseguita la migrazione:

```bash
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate
```

Servizi disponibili:

- API Laravel: http://localhost:8000
- phpMyAdmin: http://localhost:8080 (utente `root`, password `root`)
- MySQL: porta `3306` (db `laravel`, utente/password `laravel`/`laravel`)

## Avvio in locale (senza Docker)

```bash
# 1. spostati nella cartella del progetto Laravel
cd laravel-backend/app

# 2. dipendenze
composer install

# 3. configurazione
# il file .env presente nel repo è pre-configurato per Docker (DB_HOST=db):
# se lavori in locale sovrascrivilo con .env.example, che usa SQLite di default
cp .env.example .env
php artisan key:generate

# 4. database (SQLite già pronto in database/database.sqlite)
php artisan migrate

# 5. avvio API (su http://localhost:8000)
php artisan serve
```

Se preferisci usare MySQL/MariaDB locale invece di SQLite, modifica in `.env` i valori `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` con le tue credenziali prima di lanciare `php artisan migrate`.

## Frontend

Il frontend in `frontend/` è una pagina statica che chiama l'API su `http://localhost:8000/api` (URL hardcoded in `frontend/main.js`). Apri direttamente `frontend/index.html` nel browser, oppure servilo con un static server, ad esempio:

```bash
cd frontend
npx serve
```

o con l'estensione Live Server di VS Code. Il backend deve essere attivo (Docker o locale) sulla porta 8000 perché il frontend funzioni.

## API

Endpoint REST esposti in `routes/api.php`:

- `GET/POST /api/tasks`, `GET/PUT/DELETE /api/tasks/{id}` — CRUD task (`title`, `description`)
- `GET/POST /api/notes`, `GET/PUT/DELETE /api/notes/{id}` — CRUD note (`name`, `state`, collegate a un `task_id`)
