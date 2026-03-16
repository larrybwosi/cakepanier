import { UserScope, LogtoNextConfig,  } from "@logto/next";

export const logtoConfig: LogtoNextConfig = {
  endpoint: process.env.LOGTO_ENDPOINT || "",
  appId: process.env.NEXT_PUBLIC_LOGTO_APP_ID || "",
  appSecret: process.env.LOGTO_APP_SECRET || "",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
  cookieSecret: process.env.LOGTO_COOKIE_SECRET || "", 
  cookieSecure: process.env.NODE_ENV === "production",
  scopes: [
    UserScope.Email,
    UserScope.Profile,
    UserScope.Organizations,
    "urn:logto:scope:organizations",
  ],
};
