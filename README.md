# AnnSetu frontend

React + Vite client for AnnSetu. The frontend contains no Express, MongoDB, Sarvam keys, or server code.

## Local development

```powershell
npm install
npm run dev
```

Set `VITE_API_URL` in `.env` only when the API is hosted separately, for example:

```text
VITE_API_URL=https://annsetu-server.example.com
```

Leave it empty when using the local Vite proxy with the backend at `127.0.0.1:4000`.
