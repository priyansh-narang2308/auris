import { prisma } from "@/lib/db"


/**
 * Utility functions for Slack authentication and authorization.
 * This file handles retrieving Slack installation details and bot tokens
 * from the database to authorize incoming Slack events.
 */

export async function authorizeSlack(source: { teamId?: string }) {


    try {
        const { teamId } = source

        if (!teamId) {
            throw new Error("Team ID is required")

        }


        const installation = await prisma.slackInstallation.findUnique({
            where: {
                teamId: teamId
            }
        })

        if (!installation || installation.active) {
            console.error('Installation not found or inactive for the team:', teamId)
            throw new Error(`Installation not found or inactive for the team: ${teamId}`)
        }
        return {
            botToken: installation.botToken,
            teamId: installation.teamId,
        }




    } catch (error) {
        console.error('Error authorizing Slack:', error)
        throw error
    }


}