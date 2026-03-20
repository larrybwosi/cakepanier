"use server";

import { getBaseUrl } from "./token";
import { dealioFetch } from "./errors";
import type {
    DealioCart,
    DealioCartResponse,
    DealioCheckoutPayload,
} from "./types";

import { getAccessToken, getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "../logto.config";

const API_RESOURCE = process.env.LOGTO_ECOMMERCE_AUDIENCE!;
const ORGANIZATION_ID = process.env.LOGTO_ORGANIZATION_ID!;

/**
 * Helper to securely extract the active user's Logto access token
 */
async function getUserToken(): Promise<string> {
    const { isAuthenticated } = await getLogtoContext(logtoConfig);

    if (!isAuthenticated) {
        throw new Error("UNAUTHORIZED: User is not logged in");
    }

    const token = await getAccessToken(
        logtoConfig,
        API_RESOURCE,
        ORGANIZATION_ID,
    );

    if (!token) {
        throw new Error("UNAUTHORIZED: Could not retrieve access token");
    }

    return token;
}

/**
 * Fetches the current active cart for the customer.
 */
export async function getCart(): Promise<DealioCart> {
    const base = getBaseUrl();
    const token = await getUserToken();
    console.log(token);
    const res = await dealioFetch<DealioCartResponse>(`${base}/users/me/cart`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    return res.data;
}

/**
 * Adds a product variant to the cart.
 */
export async function addToCart(
    productId: string,
    quantity: number = 1,
): Promise<DealioCart> {
    const base = getBaseUrl();
    const token = await getUserToken();
    const res = await dealioFetch<DealioCartResponse>(`${base}/users/me/cart`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
    });
    return res.data;
}

/**
 * Removes or decrements an item in the cart.
 */
export async function removeFromCart(
    productId: string,
    removeEntirely: boolean = false,
): Promise<DealioCart> {
    const base = getBaseUrl();
    const token = await getUserToken();
    const res = await dealioFetch<DealioCartResponse>(
        `${base}/users/me/cart?productId=${productId}&removeEntirely=${removeEntirely}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        },
    );
    return res.data;
}

/**
 * Processes checkout for the cart.
 */
export async function checkout(
    payload: DealioCheckoutPayload,
): Promise<{ success: boolean; data: any }> {
    const base = getBaseUrl();
    const token = await getUserToken();
    const res = await dealioFetch<{ success: boolean; data: any }>(
        `${base}/users/me/cart/checkout`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        },
    );
    return res;
}
