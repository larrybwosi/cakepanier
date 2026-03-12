// libraries/logto.js (or wherever you initialize Logto)
import LogtoClient from "@logto/next";

export const logtoClient = new LogtoClient({
  endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT!, // e.g., https://abc.logto.app
  appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!, // e.g., http://localhost:3000
  cookieSecret: process.env.LOGTO_COOKIE_SECRET!,
  cookieSecure: process.env.NODE_ENV === "production",
  resources: [process.env.NEXT_PUBLIC_LOGTO_ECOMMERCE_AUDIENCE!], // Crucial for Dealio API
  scopes: [
    "urn:logto:scope:organizations", // Required to get the organization_id claim
    "email",
    "profile",
  ],
});

export const logtoConfig = {
  endpoint: "http://localhost:3001/",
  appId: "61v62s7yjlk6tri8g037o",
  appSecret: "CNMtNB0NMRbXmrliEKM29VOhXzacyBla",
  baseUrl: "http://localhost:3003", // Change to your own base URL
  cookieSecret: "b2yVN1YZlTDNH2P3elenejOUSJtEwuux", // Auto-generated 32 digit secret
  cookieSecure: process.env.NODE_ENV === "production",
};


// export const logtoConfig = {
//   endpoint: "https://default.logto.app/",
//   appId: "n159rn69h9412qwf35fvx",
//   appSecret: "isw2idx5YfvYPlXheQUsBvnHLj6EX8Ip",
//   baseUrl: "http://localhost:3000", // Change to your own base URL
//   cookieSecret: "6hb4t9naBEj5EYYcn72LZVVS2z9NsWWJ", // Auto-generated 32 digit secret
//   cookieSecure: process.env.NODE_ENV === "production",
// };

// app/logto.js
// export const logtoConfig = {
//   endpoint: process.env.NEXT_PUBLIC_LOGTO_ENDPOINT,
//   appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID,
//   appSecret: process.env.LOGTO_APP_SECRET,
//   baseUrl: process.env.NEXT_PUBLIC_BASE_URL, // e.g., http://localhost:3000
//   cookieSecret: process.env.LOGTO_COOKIE_SECRET, // MUST be exactly 32 chars
//   cookieSecure: process.env.NODE_ENV === 'production',
  
//   // Dealio-specific requirements
//   resources: [process.env.NEXT_PUBLIC_LOGTO_ECOMMERCE_AUDIENCE],
//   scopes: [
//     'urn:logto:scope:organizations', // Required by Dealio for tenant routing
//     'email',
//     'profile'
//   ],
// };