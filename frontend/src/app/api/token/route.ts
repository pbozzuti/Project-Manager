import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { auth } from "@/auth";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  // Short-lived on purpose — this is what the browser attaches to every
  // FastAPI call, re-fetched by the client as it nears expiry.
  const token = await new SignJWT({ name: session.user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.user.email)
    .setIssuedAt()
    .setExpirationTime("30m")
    .sign(secret);

  return NextResponse.json({ token });
}
