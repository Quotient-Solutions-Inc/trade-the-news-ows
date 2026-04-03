import { signTypedData } from "@open-wallet-standard/core";
import type { X402Challenge, X402PaymentResult } from "./types";

export type { X402Challenge, X402PaymentResult };

export async function x402Fetch(
  url: string,
  walletName: string,
  options?: RequestInit,
): Promise<X402PaymentResult> {
  const response = await fetch(url, options);

  if (response.status !== 402) {
    return {
      success: response.ok,
      responseBody: await response.json(),
    };
  }

  const paymentRequired = response.headers.get("PAYMENT-REQUIRED");
  if (!paymentRequired) {
    throw new Error("402 response missing PAYMENT-REQUIRED header");
  }

  const challenge: X402Challenge = JSON.parse(paymentRequired);
  const signedPayload = await signTypedData(
    walletName,
    "evm",
    JSON.stringify(challenge),
  );

  const retryResponse = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      "PAYMENT-SIGNATURE": signedPayload,
    },
  });

  const responseBody = await retryResponse.json();
  const paymentResponse =
    retryResponse.headers.get("PAYMENT-RESPONSE") ?? undefined;

  return {
    success: retryResponse.ok,
    responseBody,
    paymentResponse,
  };
}
