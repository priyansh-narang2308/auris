import "dotenv/config";
import path from "path";
import * as fs from "fs";
import { prisma } from "@/lib/db";
import { randomUUID } from "crypto";

export async function seedMeetings() {
  try {
    const dataPath = path.join(__dirname, "data");

    const transcript1 = JSON.parse(
      fs.readFileSync(
        path.join(dataPath, "transcripts", "transcript1.json"),
        "utf8"
      )
    );
    const transcript2 = JSON.parse(
      fs.readFileSync(
        path.join(dataPath, "transcripts", "transcript2.json"),
        "utf8"
      )
    );
    const transcript3 = JSON.parse(
      fs.readFileSync(
        path.join(dataPath, "transcripts", "transcript3.json"),
        "utf8"
      )
    );

    const summaryData = JSON.parse(
      fs.readFileSync(path.join(dataPath, "summaries.json"), "utf8")
    );
    const actionItems = JSON.parse(
      fs.readFileSync(path.join(dataPath, "action-items.json"), "utf8")
    );
    const titles = JSON.parse(
      fs.readFileSync(path.join(dataPath, "title.json"), "utf8")
    );

    const userId = "user_37DM0FS3URgK9CIVSQjOPBiHFvM";
    const recordingUrl =
      "https://auris.s3.eu-north-1.amazonaws.com/test-audio.mp3";

    const now = new Date();
    // start time is 30 mns before the start time
    const startTime = new Date(now.getTime() - 30 * 60 * 1000);
    // ending after 5 minutes when it has ended
    const endTime = new Date(now.getTime() - 5 * 60 * 1000);

    const meetings = [
      {
        transcript: transcript1,
        title: titles[0].title,
        description: titles[0].description,
      },
      {
        transcript: transcript2,
        title: titles[1].title,
        description: titles[1].description,
      },
      {
        transcript: transcript3,
        title: titles[2].title,
        description: titles[2].description,
      },
    ];

    for (let i = 0; i < meetings.length; i++) {
      const meeting = meetings[i];

      await prisma.meeting.create({
        data: {
          userId: userId,
          title: meeting.title,
          description: meeting.description,
          meetingUrl: "https://meet.google.com/drr-seix-gbw",
          startTime: startTime,
          endTime: endTime,

          calendarEventId: randomUUID(),
          isFromCalendar: true,

          botScheduled: true,
          botSent: true,
          botId: randomUUID(),
          botJoinedAt: startTime,

          meetingEnded: true,
          transcriptReady: true,
          transcript: meeting.transcript,
          recordingUrl: recordingUrl,

          summary: summaryData.summary,
          actionItems: actionItems,
          processed: true,
          processedAt: endTime,
          emailSent: true,
          emailSentAt: endTime,
          ragProcessed: false,
        },
      });
    }
  } catch (error) {
    console.error("Error seeding meetings: ", error);
  }
}

seedMeetings();
