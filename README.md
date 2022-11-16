# web3 login

> sign-in with Ethereum & Next.js 13

wallet-based account management powered by off-chain authenticated sessions implementing [EIP-4361: Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361)

_note: obtaining an [infura](https://infura.io) or [alchemy](https://www.alchemy.com) node key is highly recommended when running this app_

## to run

- install dependencies:
  - `npm install`
- make a copy of `.env.example` named `.env`
- in `.env`, add your infura id to `INFURA_ID` and a `SESSION_PASSWORD`
- run local server:
  - `npm run dev`
- navigate to `localhost:3000` in the browser
