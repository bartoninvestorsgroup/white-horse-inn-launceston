import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

function unauthorized() {
  return NextResponse.json({ revalidated: false }, { status: 401 });
}

const menuPaths = [
  "/food",
];

export async function POST(request) {
  const secretFromHeader = request.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.REVALIDATE_SECRET;

  if (!expectedSecret) {
    return NextResponse.json(
      { revalidated: false, message: "Missing REVALIDATE_SECRET" },
      { status: 500 },
    );
  }

  if (secretFromHeader !== expectedSecret) {
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

  if (documentType === "menu") {
    revalidateTag("sanity:menus");

    menuPaths.forEach((path) => {
      revalidatePath(path);
    });

    if (slug) {
      revalidateTag(`sanity:menu:${slug}`);
    }

    return NextResponse.json({
      revalidated: true,
      target: "menu",
      slug,
      paths: menuPaths,
    });
  }

  return NextResponse.json({
    revalidated: false,
    message: "Unsupported document type",
    documentType,
  });
}
