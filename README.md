# web3-login

> a starter for fullstack passwordless web3 profiles with Next.js, TypeScript, Postgres & [SIWE](https://eips.ethereum.org/EIPS/eip-4361)

## pre-reqs

- a postgres database with a connection URL
- _(optional)_ an [alchemy](https://www.alchemy.com) or [infura](https://infura.io) API key

## to run

1. install dependencies:
   ```
   npm install
   ```
1. make a copy of `.env.example` named `.env` and add credentials
1. run database setup migration:
   ```
   npm run db:up
   ```
1. run local development server:
   ```
   npm run dev
   ```
1. check out `localhost:3000` in the browser!

**_power tip:_** migrate down the database if required:
```
npm run db:down
```
