import { NextRequest, NextResponse } from "next/server";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@repo/lib/logto.config";
import { getProductReviews, addReview } from "@repo/lib/dealio/reviews";
import { DealioApiError } from "@repo/lib/dealio/errors";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json(
                { error: "MISSING_PRODUCT_ID" },
                { status: 400 },
            );
        }

        const reviews = await getProductReviews(productId);
        return NextResponse.json(reviews);
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
        const { productId, rating, title, comment } = body;

        if (!productId || !rating || !comment) {
            return NextResponse.json(
                { error: "VALIDATION" },
                { status: 400 },
            );
        }

        const review = await addReview(productId, { rating, title, comment });
        return NextResponse.json(review);
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
    console.error("[dealio/reviews]", err);
    return NextResponse.json(
        { error: "INTERNAL", message: "Failed to process reviews operation" },
        { status: 500 },
    );
}
