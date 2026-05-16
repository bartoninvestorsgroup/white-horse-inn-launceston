import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

function unauthorized() {
  return NextResponse.json({ revalidated: false }, { status: 401 });
}

export async function POST(request) {
  const secretFromQuery = request.nextUrl.searchParams.get("secret");
  const secretFromHeader = request.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { revalidated: false, message: "Missing REVALIDATE_SECRET" },
      { status: 500 },
    );
  }

  if (
    secretFromQuery !== expectedSecret &&
    secretFromHeader !== expectedSecret
  ) {
    return unauthorized();
  }

  const body = await request.json().catch(() => ({}));
  const documentType = body?._type || body?.type || body?.documentType;
  const slug =
    body?.slug?.current || body?.slug || body?.document?.slug?.current || null;

  if (documentType === "siteBanner") {
    revalidateTag("sanity:siteBanner");
    revalidatePath("/", "layout");

    return NextResponse.json({ revalidated: true, target: "siteBanner" });
  }

  if (documentType === "event") {
    revalidateTag("sanity:events");
    revalidatePath("/whats-on");

    if (slug) {
      revalidateTag(`sanity:event:${slug}`);
      revalidatePath(`/whats-on/${slug}`);
    }

    return NextResponse.json({
      revalidated: true,
      target: "event",
      slug,
    });
  }

  return NextResponse.json({
    revalidated: false,
    message: "Unsupported document type",
    documentType,
  });
}
