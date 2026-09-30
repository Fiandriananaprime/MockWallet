# NovaMarket Wallet

Frontend for the NovaMarket mobile money wallet.

## Development

```bash
npm install
npm run dev
```

The API endpoint can be configured with `VITE_API_URL`. The default endpoint is
the hosted mock mobile money service.

After a phone verification request, the mock provider pushes the simulated SMS
over WebSocket to the wallet notification button. The notification panel shows
the message, phone number, OTP and timestamp; no real SMS provider is used.

## Checks

```bash
npm run build
npm run lint
npm run typecheck
```
