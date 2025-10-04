import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

/**
 * GET /api/api-keys
 * List all API keys for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        key: true, // In production, you might want to mask this
        createdAt: true,
        lastUsedAt: true,
        expiresAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error("Failed to fetch API keys:", error);
    return NextResponse.json(
      { error: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/api-keys
 * Generate a new API key
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const name = body.name || "API Key";

    // Generate a secure random API key
    const apiKey = `glci_${crypto.randomBytes(32).toString("hex")}`;

    const newApiKey = await prisma.apiKey.create({
      data: {
        userId: user.id,
        name,
        key: apiKey,
      },
    });

    return NextResponse.json({
      apiKey: {
        id: newApiKey.id,
        name: newApiKey.name,
        key: newApiKey.key,
        createdAt: newApiKey.createdAt,
      },
    });
  } catch (error) {
    console.error("Failed to create API key:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/api-keys
 * Delete an API key
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get("id");

    if (!keyId) {
      return NextResponse.json(
        { error: "API key ID is required" },
        { status: 400 }
      );
    }

    // Verify the key belongs to the user
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: user.id,
      },
    });

    if (!apiKey) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 });
    }

    // Soft delete by marking as inactive
    await prisma.apiKey.update({
      where: { id: keyId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete API key:", error);
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}
