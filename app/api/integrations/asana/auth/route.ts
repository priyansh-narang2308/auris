import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(
      new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL)
    );
  }

  const asanaClientId = process.env.ASANA_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/asana/callback`;

  // these are the scopes what we can do
  const scope =
    "projects:read projects:write tasks:read tasks:write users:read workspaces:read";

  // check if its the same state
  const state = userId;

  const authUrl = `https://app.asana.com/-/oauth_authorize?client_id=${asanaClientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&state=${state}&scope=${encodeURIComponent(scope)}`;

  return NextResponse.redirect(authUrl);
}
