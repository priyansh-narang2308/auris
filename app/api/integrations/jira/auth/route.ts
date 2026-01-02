import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "User unauthorized." }, { status: 401 });
  }

  const clientId = process.env.JIRA_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!clientId) {
    console.error("Missing JIRA_CLIENT_ID in environment variables");
    return NextResponse.json(
      { error: "Internal Configuration Error: Jira Client ID is missing." },
      { status: 500 }
    );
  }

  if (!appUrl) {
    console.error("Missing NEXT_PUBLIC_APP_URL in environment variables");
    return NextResponse.json(
      { error: "Internal Configuration Error: App URL is missing." },
      { status: 500 }
    );
  }

  const redirectUri = `${appUrl}/api/integrations/jira/callback`;

  const scope =
    "read:jira-work write:jira-work manage:jira-project manage:jira-configuration read:jira-user offline_access";

  const state = userId;

  const params = new URLSearchParams({
    audience: "api.atlassian.com",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    state: state,
    response_type: "code",
    prompt: "consent",
  });

  const authUrl = `https://auth.atlassian.com/authorize?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
