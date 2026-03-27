import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { saveSecret } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const { text, password } = await req.json();
    
    console.log("Creating secret, text length:", text?.length);

    if (!text || text.length > 10000) {
      return NextResponse.json(
        { error: "Secret too long or empty" },
        { status: 400 }
      );
    }

    const id = nanoid(8);
    console.log("Generated ID:", id);
    
    await saveSecret(id, text, password || null);
    console.log("Secret saved to Redis");

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Create error details:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create secret" },
      { status: 500 }
    );
  }
}
