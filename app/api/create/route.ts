import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { saveSecret } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { text, password } = await req.json();

    if (!text || text.length > 10000) {
      return NextResponse.json(
        { error: "Secret too long or empty" },
        { status: 400 }
      );
    }

    const id = nanoid(8);
    await saveSecret(id, text, password || null);

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Create error:", error);
    return NextResponse.json(
      { error: "Failed to create secret" },
      { status: 500 }
    );
  }
}
