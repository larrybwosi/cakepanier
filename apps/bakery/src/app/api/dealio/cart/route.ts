import { NextRequest, NextResponse } from "next/server";
import {
    getLogtoContext,
    getOrganizationToken,
} from "@logto/next/server-actions";
import { logtoConfig } from "@repo/lib/logto.config";
import { getCart, addToCart, removeFromCart } from "@repo/lib/dealio/cart";
import { getCatalogProducts } from "@repo/lib/dealio/catalog";
import { DealioApiError } from "@repo/lib/dealio/errors";
import { DealioCart, DealioProduct } from "@repo/lib/dealio/types";

async function enrichCart(cart: DealioCart) {
    const allProducts = await getCatalogProducts();

    const enrichedItems = cart.items.map((item) => {
        // productId in V2 Cart is the variantId
        const variantId = item.productId;
        let foundProduct: DealioProduct | null = null;
        let foundVariant: any = null;

        for (const p of allProducts.products) {
            const v = p.variants?.find((v) => v.id === variantId);
            if (v) {
                foundProduct = p;
                foundVariant = v;
                break;
            }
        }

        return {
            ...item,
            variantId,
            productName: foundProduct?.name ?? `Product ${variantId.slice(-4)}`,
            variantName: foundVariant?.name,
            variantPrice: foundVariant?.price ?? 0,
            productImage: foundProduct?.images?.[0],
            addOns: [], // Not supported in V2 API yet
        };
    });

    return {
        ...cart,
        items: enrichedItems,
    };
}

export async function GET(req: NextRequest) {
    try {
        const { isAuthenticated } = await getLogtoContext(logtoConfig);
        if (!isAuthenticated) {
            return NextResponse.json(
                { error: "UNAUTHORIZED" },
                { status: 401 },
            );
        }

        const cart = await getCart();
        const enriched = await enrichCart(cart);
        return NextResponse.json(enriched);
    } catch (err) {
        return handleError(err);
    }
}

export async function POST(req: NextRequest) {
    try {
        const { isAuthenticated } = await getLogtoContext(logtoConfig);
        if (!isAuthenticated) {
            return NextResponse.json(
                { error: "UNAUTHORIZED" },
                { status: 401 },
            );
        }

        const body = await req.json();
        const { productId, quantity } = body;

        const cart = await addToCart(productId, quantity);
        const enriched = await enrichCart(cart);
        return NextResponse.json(enriched);
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { isAuthenticated } = await getLogtoContext(logtoConfig);
        if (!isAuthenticated) {
            return NextResponse.json(
                { error: "UNAUTHORIZED" },
                { status: 401 },
            );
        }

        const { searchParams } = req.nextUrl;
        const productId = searchParams.get("productId");
        const removeEntirely = searchParams.get("removeEntirely") === "true";

        if (!productId) {
            return NextResponse.json(
                { error: "MISSING_PRODUCT_ID" },
                { status: 400 },
            );
        }

        const cart = await removeFromCart(productId, removeEntirely);
        const enriched = await enrichCart(cart);
        return NextResponse.json(enriched);
    } catch (err) {
        return handleError(err);
    }
}

function handleError(err: unknown) {
    if (err instanceof DealioApiError) {
        const status = err.status >= 500 ? 502 : err.status;
        return NextResponse.json(
            { error: err.code, message: err.message },
            { status },
        );
    }
    console.error("[dealio/cart]", err);
    return NextResponse.json(
        { error: "INTERNAL", message: "Failed to process cart operation" },
        { status: 500 },
    );
}
