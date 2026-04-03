export interface X402Challenge {
  scheme: string;
  network: string;
  payTo: string;
  price: string;
}

export interface X402PaymentResult {
  success: boolean;
  responseBody: unknown;
  paymentResponse?: string;
}
