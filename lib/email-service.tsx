import MeetingSummaryEmailNew from "@/components/email/meeting-summary"
import { render } from "@react-email/render"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

interface EmailData {
    userEmail: string
    userName: string
    meetingTitle: string
    summary: string
    actionItems: Array<{
        id: number
        text: string
    }>
    meetingId: string
    meetingDate: string
}


export async function sendMeetingSummaryEmail(data: EmailData) {

    try {

        const emailHTML = await render(
            <MeetingSummaryEmailNew userName={data.userName}
                meetingTitle={data.meetingTitle}
                summary={data.summary}
                actionItems={data.actionItems}
                meetingId={data.meetingId}
                meetingDate={data.meetingDate}
            />
        )

        const result = await resend.emails.send({
            from: "Auris <onboarding@resend.dev>",
            to: [data.userEmail],
            replyTo: "priyanshnarang23@gmail.com",
            subject: `Meeting Summary Ready - ${data.meetingTitle}`,
            html: emailHTML,
            tags: [
                {
                    name: 'category',
                    value: 'meeting-summary'
                },
                {
                    name: 'meeting-id',
                    value: data.meetingId
                }
            ]
        })

        return result
    } catch (error) {
        console.log("Error rendering email", error);
        return null;
    }

}