import { UserScope, LogtoNextConfig } from "@logto/next";

export const logtoConfig: LogtoNextConfig = {
    endpoint: process.env.LOGTO_ENDPOINT || "http://localhost:3001",
    appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID || "appId",
    appSecret: process.env.LOGTO_APP_SECRET || "appSecret",
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    cookieSecret: process.env.LOGTO_COOKIE_SECRET || "cookieSecret-at-least-32-chars-long",
    cookieSecure: process.env.NODE_ENV === "production",
    scopes: [
        UserScope.Email,
        UserScope.Profile,
        UserScope.Organizations,
        "urn:logto:scope:organizations",
        "ecommerce:cart:read",
        "ecommerce:cart:write",
    ],
    resources: [process.env.LOGTO_ECOMMERCE_AUDIENCE!],
};
