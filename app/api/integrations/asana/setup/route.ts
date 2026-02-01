/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/db";
import { AsanaAPI } from "@/lib/integrations/asana/asana";
import { refreshAsanaToken } from "@/lib/integrations/asana/refresh-token";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

async function getValidToken(integration: any) {
  if (integration.expiresAt && new Date() > integration.expiresAt) {
    const updated = await refreshAsanaToken(integration);
    return updated.accessToken;
  }

  return integration.accessToken;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "User unauthorized" }, { status: 401 });
  }

  const integration = await prisma.userIntegration.findUnique({
    where: {
      userId_platform: {
        userId: userId,
        platform: "asana",
      },
    },
  });

  if (!integration) {
    return NextResponse.json(
      { error: "Asana not connected with the user" },
      { status: 400 }
    );
  }

  try {
    const validToken = await getValidToken(integration);
    const asana = new AsanaAPI();

    const workspaces = await asana.getWorkspaces(validToken); //get the workspace for the current token
    console.log("[Asana Setup] Available Workspaces:", JSON.stringify(workspaces, null, 2));
    const workspaceId = workspaces.data[0]?.gid;   //this is the globalId: gid that asana holds thats in it workspace itself 


    if (!workspaceId) {
      console.warn("[Asana Setup] No workspaceId found for user");
      return NextResponse.json(
        { error: "No workspace found" },
        { status: 400 }
      );
    }

    const projects = await asana.getProjects(validToken, workspaceId);

    return NextResponse.json({
      projects: projects.data || [],
      workspaceId,
    });
  } catch (error) {
    console.error("Error fetching asana projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch asana projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "User unauthorized" }, { status: 401 });
  }

  const { projectId, projectName, workspaceId, createNew } =
    await request.json();

  const integration = await prisma.userIntegration.findUnique({
    where: {
      userId_platform: {
        userId: userId,
        platform: "asana",
      },
    },
  });

  if (!integration) {
    return NextResponse.json(
      { error: "Asana not connected with the user" },
      { status: 400 }
    );
  }

  try {
    const validToken = await getValidToken(integration);
    const asaanaa = new AsanaAPI();

    console.log("[Asana Setup] Request Data:", { projectId, projectName, workspaceId, createNew });

    // using let as we have to reassign
    let finalProjectId = projectId;
    let finalProjectName = projectName;

    // if the user wants to create a new project create it and update the current id and name 
    if (createNew && projectName) {
      console.log("[Asana Setup] Creating new project:", projectName, "in workspace:", workspaceId);
      const newProject = await asaanaa.createProject(
        validToken,
        workspaceId,
        projectName
      );
      finalProjectId = newProject.data.gid;  //gid again as asana uses
      finalProjectName = newProject.data.name;
    }

    await prisma.userIntegration.update({
      where: {
        id: integration.id,
      },
      data: {
        projectId: finalProjectId,
        projectName: finalProjectName,
        workspaceId: workspaceId,
      },
    });

    return NextResponse.json({
      success: true,
      projectId: finalProjectId,
      projectName: finalProjectName,
    });
  } catch (error) {
    console.error("Error in setting up the asana project: ", error);
    return NextResponse.json(
      { error: "Failed to setup asana project. Please try again later." },
      { status: 500 }
    );
  }
}
