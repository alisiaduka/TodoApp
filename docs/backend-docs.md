# Dokumentimi i Back-End

## Teknologjite e perdorura
- Express.js me TypeScript
- MySQL per databaze
- JWT per autentikim

## Struktura e backend
- controllers/ - Logjika e biznesit
- routes/ - Endpoint-et e API
- models/ - Modelet e te dhenave
- middleware/ - Autentikimi dhe validimi
- config/ - Konfigurimi i DB

## Endpoint-et kryesore
| Metoda | Endpoint | Pershkrimi |
|--------|----------|------------|
| POST | /api/auth/register | Regjistrim perdoruesi |
| POST | /api/auth/login | Login dhe marrja e token |
| GET | /api/todos | Merr te gjitha todos |
| POST | /api/todos | Krijo todo te ri |
| PUT | /api/todos/:id | Perditeso todo |
| DELETE | /api/todos/:id | Fshij todo |
