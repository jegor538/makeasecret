import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { saveSecret } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, password } = body;
    
    console.log("API /create called");
    console.log("Text length:", text?.length);
    console.log("Password provided:", !!password);

    if (!text || text.length > 10000) {
      console.log("Validation failed");
      return NextResponse.json(
        { error: "Secret too long or empty" },
        { status: 400 }
      );
    }

    const id = nanoid(8);
    console.log("Generated ID:", id);
    
    await saveSecret(id, text, password || null);
    console.log("Secret saved successfully");

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Create error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create secret" },
      { status: 500 }
    );
  }
}
