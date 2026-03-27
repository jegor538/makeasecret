import { NextRequest, NextResponse } from "next/server";
import { getAndDeleteSecret } from "@/lib/redis";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { password } = await req.json();
    const result = await getAndDeleteSecret(params.id, password || null);

    if (!result) {
      return NextResponse.json(
        { error: "Secret not found or already destroyed" },
        { status: 404 }
      );
    }

    if ("needPassword" in result && result.needPassword) {
      return NextResponse.json(
        { error: "Password required" },
        { status: 402 }
      );
    }

    return NextResponse.json({ text: result.text });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve secret" },
      { status: 500 }
    );
  }
}
