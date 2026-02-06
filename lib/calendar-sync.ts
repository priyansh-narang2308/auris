/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "./db";

export async function syncUserCalendar(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.calendarConnected || !user.googleAccessToken) {
            return { success: false, error: "Calendar not connected or user not found" };
        }

        let accessToken = user.googleAccessToken;
        const now = new Date();
        const tokenExpiry = user.googleTokenExpiry ? new Date(user.googleTokenExpiry) : new Date(0);
        const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

        if (tokenExpiry <= tenMinutesFromNow) {
            accessToken = await refreshGoogleToken(user);
            if (!accessToken) {
                return { success: false, error: "Failed to refresh Google token" };
            }
        }

        const sevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        // Use a slightly earlier timeMin to catch ongoing meetings or meetings that just started
        const timeMin = new Date(now.getTime() - 30 * 60 * 1000).toISOString();

        const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
            `timeMin=${timeMin}&` +
            `timeMax=${sevenDays.toISOString()}&` +
            `singleEvents=true&orderBy=startTime&showDeleted=true&conferenceDataVersion=1`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) {
            if (response.status === 401) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { calendarConnected: false }
                });
                return { success: false, error: "Unauthorized - Calendar disconnected" };
            }
            throw new Error(`Calendar API failed: ${response.status}`);
        }

        const data = await response.json();
        const events = data.items || [];

        // Get existing calendar events for this user to identify deletions
        const existingEvents = await prisma.meeting.findMany({
            where: {
                userId: user.id,
                isFromCalendar: true,
                startTime: {
                    gte: new Date(timeMin)
                }
            }
        });

        const googleEventIds = new Set();
        for (const event of events) {
            if (event.status === 'cancelled') {
                await handleDeletedEvent(event.id);
                continue;
            }
            googleEventIds.add(event.id);
            await processEvent(user, event);
        }

        // Handle events that were deleted from Google Calendar but still exist in our DB
        const deletedEvents = existingEvents.filter(
            dbEvent => dbEvent.calendarEventId && !googleEventIds.has(dbEvent.calendarEventId)
        );

        if (deletedEvents.length > 0) {
            for (const deletedEvent of deletedEvents) {
                await prisma.meeting.delete({
                    where: { id: deletedEvent.id }
                });
            }
        }

        return { success: true, count: events.length };
    } catch (error: any) {
        console.error(`Calendar sync error for ${userId}:`, error.message);
        return { success: false, error: error.message };
    }
}

async function refreshGoogleToken(user: any) {
    try {
        if (!user.googleRefreshToken) {
            await prisma.user.update({
                where: { id: user.id },
                data: { calendarConnected: false, googleAccessToken: null }
            });
            return null;
        }

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                refresh_token: user.googleRefreshToken,
                grant_type: 'refresh_token'
            })
        });
        const tokens = await response.json();

        if (!tokens.access_token) {
            await prisma.user.update({
                where: { id: user.id },
                data: { calendarConnected: false }
            });
            return null;
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                googleAccessToken: tokens.access_token,
                googleTokenExpiry: new Date(Date.now() + (tokens.expires_in * 1000))
            }
        });
        return tokens.access_token;
    } catch (error) {
        console.error(`token refresh error for user ${user.id}: `, error);
        return null;
    }
}

async function handleDeletedEvent(calendarEventId: string) {
    try {
        await prisma.meeting.deleteMany({
            where: { calendarEventId: calendarEventId }
        });
    } catch (error: any) {
        console.error('Error deleting event:', error.message);
    }
}

async function processEvent(user: any, event: any) {
    const meetingUrl = event.hangoutLink || event.conferenceData?.entryPoints?.[0]?.uri;

    // We only sync meetings that have a join URL
    if (!meetingUrl || !event.start?.dateTime) {
        return;
    }

    const eventData = {
        calendarEventId: event.id,
        userId: user.id,
        title: event.summary || 'Untitled Meeting',
        description: event.description || null,
        meetingUrl: meetingUrl,
        startTime: new Date(event.start.dateTime),
        endTime: new Date(event.end.dateTime),
        attendees: event.attendees ? event.attendees.map((a: any) => a.email) : [],
        isFromCalendar: true,
        botScheduled: true
    };

    try {
        await prisma.meeting.upsert({
            where: { calendarEventId: event.id },
            update: {
                title: eventData.title,
                description: eventData.description,
                meetingUrl: eventData.meetingUrl,
                startTime: eventData.startTime,
                endTime: eventData.endTime,
                attendees: eventData.attendees,
            },
            create: eventData
        });
    } catch (error: any) {
        console.error(`Error upserting event ${event.id}:`, error.message);
    }
}
