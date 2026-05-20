# todo-list-manager-laravel

Un gestore di todo list ispirato a Google Keep, costruito con Laravel: crea, organizza e gestisci note e task con etichette, colori e promemoria.

## Avvio

Requisiti: PHP 8.1+, Composer, MariaDB/MySQL, Node (per il frontend statico).

```bash
# 1. dipendenze
composer install

# 2. configurazione
cp .env.example .env
php artisan key:generate
# poi modifica .env con le credenziali del tuo database

# 3. database
php artisan migrate

# 4. avvio API (su http://localhost:8000)
php artisan serve
```

Il frontend è una pagina statica HTML/CSS/JS che parla con l'API: aprila direttamente nel browser oppure servila con un qualsiasi static server (es. `npx serve` o l'estensione Live Server di VS Code).
