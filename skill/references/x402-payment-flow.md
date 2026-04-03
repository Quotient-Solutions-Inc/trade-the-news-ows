# x402 Payment Flow — Technical Reference

## Overview

x402 is an HTTP-native payment protocol. Clients pay per-request by signing EIP-712 typed data challenges. No API keys. No accounts. No sessions.

## Network Details

- **Chain**: Base mainnet (`eip155:8453`)
- **Token**: USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
- **Facilitator**: `x402.org`

## Flow

### Step 1: Initial Request

Send a standard HTTP request with no authentication headers.

```
GET https://api.quotient.social/api/v1/markets
```

### Step 2: 402 Payment Required

The server returns HTTP 402 with a `PAYMENT-REQUIRED` header containing a JSON challenge:

```
HTTP/1.1 402 Payment Required
PAYMENT-REQUIRED: {"type":"eip712","amount":"5000","token":"0x833589...","chainId":8453,"recipient":"0x...","validUntil":1711234567,"nonce":"abc123",...}
```

The challenge is an EIP-712 typed data object specifying the amount (in token base units), recipient, and validity window.

### Step 3: Sign with OWS

Sign the challenge using `signTypedData` from `@open-wallet-standard/core`:

```typescript
import { signTypedData } from "@open-wallet-standard/core";

const signedPayload = await signTypedData(
  walletName,
  "evm",
  JSON.stringify(challenge)
);
```

### Step 4: Retry with Signature

Resend the original request with the signed payload in the `PAYMENT-SIGNATURE` header:

```
GET https://api.quotient.social/api/v1/markets
PAYMENT-SIGNATURE: <signed-payload>
```

### Step 5: Facilitator Verification

The server forwards the signature to the x402 facilitator (`x402.org`) for verification. The facilitator confirms the signer has sufficient USDC balance and the signature is valid.

### Step 6: Response with Settlement

The server returns the API response with a `PAYMENT-RESPONSE` header confirming payment settlement:

```
HTTP/1.1 200 OK
PAYMENT-RESPONSE: {"status":"settled","txHash":"0x...","amount":"5000"}
Content-Type: application/json

{ "data": [...] }
```

### Step 7: Idempotent Retries

If a request fails after payment, retry with the same `Payment-Identifier` to avoid double-charging. The facilitator tracks payment identifiers and returns the cached response for duplicate payments.

## Using x402Fetch

The `x402Fetch` helper handles the full flow automatically:

```typescript
import { x402Fetch } from "trade-the-news-ows/x402";

const result = await x402Fetch(
  "https://api.quotient.social/api/v1/markets",
  "your-wallet-name"
);

if (result.success) {
  console.log(result.responseBody);       // API response
  console.log(result.paymentResponse);    // Settlement confirmation
}
```

It sends the initial request, handles the 402 challenge-response cycle, and returns the final result.
