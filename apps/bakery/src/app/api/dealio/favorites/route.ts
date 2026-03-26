import { NextRequest, NextResponse } from "next/server";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@repo/lib/logto.config";
import { getFavorites, addToFavorites, removeFromFavorites } from "@repo/lib/dealio/favorites";
import { DealioApiError } from "@repo/lib/dealio/errors";

export async function GET(req: NextRequest) {
    try {
        const { isAuthenticated } = await getLogtoContext(logtoConfig);
        if (!isAuthenticated) {
            return NextResponse.json(
                { error: "UNAUTHORIZED" },
                { status: 401 },
            );
        }

        const favorites = await getFavorites();
        return NextResponse.json(favorites);
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
        const { productId } = body;

        if (!productId) {
            return NextResponse.json(
                { error: "MISSING_PRODUCT_ID" },
                { status: 400 },
            );
        }

        const favorite = await addToFavorites(productId);
        return NextResponse.json(favorite);
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

        if (!productId) {
            return NextResponse.json(
                { error: "MISSING_PRODUCT_ID" },
                { status: 400 },
            );
        }

        await removeFromFavorites(productId);
        return NextResponse.json({ success: true });
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
    console.error("[dealio/favorites]", err);
    return NextResponse.json(
        { error: "INTERNAL", message: "Failed to process favorites operation" },
        { status: 500 },
    );
}
