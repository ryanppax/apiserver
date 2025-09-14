# JWT Auth (Option B) – Quick Start

1) Install deps
```
npm i jsonwebtoken dotenv
```

2) Configure env
```
cp .env.example .env
# edit .env as needed
```

3) Run the API
```
node src/server.js
```

4) Mint a token (dev)
```
node scripts/mintToken.js user:ryan 'items:read items:write'
```

5) Call the API
```
TOKEN=$(node scripts/mintToken.js user:ryan 'items:read items:write')
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/items
```
