import { UserIntegration } from "@prisma/client";
import { refreshJiraToken } from "./jira/refreshToken";
import { refreshAsanaToken } from "./asana/refresh-token";

export async function refreshTokenifNeed(integration: UserIntegration) {
  const now = new Date();
  const expiresAt = integration.expiresAt;

  if (!expiresAt || now >= new Date(expiresAt.getTime() - 5 * 60 * 1000)) {
    switch (integration.platform) {
      case "jira":
        return await refreshJiraToken(integration);
      case "asana":
        return await refreshAsanaToken(integration);
      default:
        return integration;
    }
  }

  return integration;
}
