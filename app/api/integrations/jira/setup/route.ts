import { prisma } from "@/lib/db";
import { JiraAPI } from "@/lib/integrations/jira/jira";
import { refreshJiraToken } from "@/lib/integrations/jira/refreshToken";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getValidToken(integration: any) {
  if (integration.expiresAt && new Date() > integration.expiresAt) {
    const updated = await refreshJiraToken(integration);
    return updated.accessToken;
  }

  return integration.accessToken;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "User unauthorized." }, { status: 401 });
  }

  const integration = await prisma.userIntegration.findUnique({
    where: {
      userId_platform: {
        userId: userId,
        platform: "jira",
      },
    },
  });

  if (!integration || !integration.workspaceId) {
    return NextResponse.json({ error: "User not connected" }, { status: 400 });
  }

  try {
    const validTken = await getValidToken(integration);
    const jira = new JiraAPI();

    const projects = await jira.getProjects(validTken, integration.workspaceId); //this is your cloudiid
    return NextResponse.json({
      projects: projects.values || [],
    });
  } catch (error) {
    console.error("Error fetching Jira projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects from Jira" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "User unauthorized." }, { status: 401 });
  }

  const { projectId, projectName, projectKey, createNew } =
    await request.json();

  const intergation = await prisma.userIntegration.findUnique({
    where: {
      userId_platform: {
        userId: userId,
        platform: "jira",
      },
    },
  });

  if (!intergation || !intergation.workspaceId) {
    return NextResponse.json({ error: "User not connected" }, { status: 400 });
  }

  try {
    const validToken = await getValidToken(intergation);
    const jira = new JiraAPI();

    let finalProjectName = projectName;
    let finalProjectKey = projectKey;

    if (createNew && projectName) {
      try {
        const suggestedKey = projectName
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, "")
          .substring(0, 10);
        const key = projectKey || suggestedKey;
        const newProject = await jira.createProject(
          validToken,
          intergation.workspaceId,
          projectName,
          key
        );
        finalProjectName = projectName;
        finalProjectKey = newProject.key;
      } catch (error) {
        console.error("failed to create prohect:", error);
        return NextResponse.json(
          {
            error:
              "Failed to create project. You may not have admin permisisons",
          },
          { status: 403 }
        );
      }
    } else if (projectId) {
      const projects = await jira.getProjects(
        validToken,
        intergation.workspaceId
      );
      const selectedProject = projects.values.find((p: { id: string; key: string; name: string }) => p.id === projectId);

      if (!selectedProject) {
        return NextResponse.json(
          { error: "project not found" },
          { status: 404 }
        );
      }

      finalProjectKey = selectedProject.key;
      finalProjectName = selectedProject.name;
    } else {
      return NextResponse.json(
        {
          error:
            "Either projectId or createNew with projectName must be provided",
        },
        { status: 400 }
      );
    }

    await prisma.userIntegration.update({
      where: {
        id: intergation.id,
      },
      data: {
        projectId: finalProjectKey,
        projectName: finalProjectName,
      },
    });

    return NextResponse.json({
      success: true,
      projectId: finalProjectKey,
      projectName: finalProjectName,
    });
  } catch (error) {
    console.error("Error setting up jira project:", error);
    return NextResponse.json(
      { error: "Failed to setup project" },
      { status: 500 }
    );
  }
}
