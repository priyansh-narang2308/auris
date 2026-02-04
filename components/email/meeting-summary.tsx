import {
    Body, Container, Head, Html, Preview, Section, Text, Button, Hr, Heading, Img, Link
} from '@react-email/components'
import * as React from 'react'

interface MeetingSummaryEmailProps {
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

export function MeetingSummaryEmailNew({
    userName,
    meetingTitle,
    summary,
    actionItems,
    meetingId,
    meetingDate
}: MeetingSummaryEmailProps) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aurismeet.vercel.app'

    return (
        <Html>
            <Head />
            <Preview>Meeting Summary: {meetingTitle}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Text style={brandText}>Auris</Text>
                    </Section>

                    <Section style={heroSection}>
                        <Heading style={heroTitle}>Meeting Processed</Heading>
                        <Text style={heroSubtitle}>{meetingTitle}</Text>
                        <Text style={heroDate}>{meetingDate}</Text>
                    </Section>

                    <Section style={content}>
                        <Text style={greeting}>Hi {userName},</Text>
                        <Text style={paragraph}>
                            Here is the AI-generated summary and action items from your recent meeting.
                        </Text>

                        <Section style={card}>
                            <Section style={cardHeader}>
                                <Text style={cardTitle}>� Executive Summary</Text>
                            </Section>
                            <Text style={cardContent}>
                                {summary}
                            </Text>
                        </Section>

                        <Section style={card}>
                            <Section style={cardHeader}>
                                <Text style={cardTitle}>✅ Action Items</Text>
                            </Section>
                            {actionItems && actionItems.length > 0 ? (
                                <Section style={actionList}>
                                    {actionItems.map((item) => (
                                        <Section key={item.id} style={actionRow}>
                                            <Text style={bulletPoint}>•</Text>
                                            <Text style={actionText}>{item.text}</Text>
                                        </Section>
                                    ))}
                                </Section>
                            ) : (
                                <Text style={emptyState}>No specific action items detected.</Text>
                            )}
                        </Section>

                        <Section style={btnContainer}>
                            <Button style={button} href={`${baseUrl}/meeting/${meetingId}`}>
                                View Full Transcript & Recording
                            </Button>
                        </Section>

                        <Hr style={hr} />

                        <Section style={footer}>
                            <Text style={footerText}>
                                © {new Date().getFullYear()} Auris Inc. All rights reserved.
                            </Text>
                            <Text style={footerLinks}>
                                <Link href={`${baseUrl}/dashboard`} style={link}>Dashboard</Link> •{" "}
                                <Link href={`${baseUrl}/settings`} style={link}>Settings</Link> •{" "}
                                <Link href={`${baseUrl}/support`} style={link}>Support</Link>
                            </Text>
                        </Section>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

export default MeetingSummaryEmailNew


const main = {
    backgroundColor: '#000000',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '580px',
}

const header = {
    padding: '24px',
    textAlign: 'center' as const,
}

const brandText = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#f97316', // Orange-500
    letterSpacing: '-1px',
    margin: '0',
}

const heroSection = {
    padding: '24px',
    textAlign: 'center' as const,
    backgroundColor: '#0a0a0a',
    borderRadius: '12px 12px 0 0',
    border: '1px solid #262626',
    borderBottom: 'none',
}

const heroTitle = {
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff',
    margin: '0 0 8px',
}

const heroSubtitle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#f97316', // Orange Brand Color
    margin: '0 0 8px',
}

const heroDate = {
    fontSize: '14px',
    color: '#a3a3a3',
    margin: '0',
}

const content = {
    backgroundColor: '#0a0a0a',
    padding: '0 24px 24px',
    borderRadius: '0 0 12px 12px',
    border: '1px solid #262626',
    borderTop: 'none',
}

const greeting = {
    fontSize: '16px',
    lineHeight: '26px',
    color: '#ffffff',
    margin: '16px 0 8px',
}

const paragraph = {
    fontSize: '15px',
    lineHeight: '24px',
    color: '#a3a3a3',
    margin: '0 0 24px',
}

const card = {
    backgroundColor: '#171717', // Zinc-900
    borderRadius: '8px',
    border: '1px solid #262626',
    marginBottom: '24px',
    overflow: 'hidden',
}

const cardHeader = {
    padding: '12px 20px',
    backgroundColor: '#262626', // Zinc-800
    borderBottom: '1px solid #262626',
}

const cardTitle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#e5e5e5',
    margin: '0',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
}

const cardContent = {
    padding: '20px',
    fontSize: '14px',
    lineHeight: '24px',
    color: '#d4d4d4',
    margin: '0',
}

const actionList = {
    padding: '16px 20px',
}

const actionRow = {
    display: 'flex',
    marginBottom: '12px',
    alignItems: 'flex-start',
}

const bulletPoint = {
    color: '#f97316',
    fontSize: '18px',
    lineHeight: '24px',
    marginRight: '12px',
    fontWeight: 'bold',
}

const actionText = {
    fontSize: '14px',
    lineHeight: '24px',
    color: '#d4d4d4',
    margin: '0',
}

const emptyState = {
    padding: '20px',
    fontSize: '14px',
    color: '#737373',
    fontStyle: 'italic',
    textAlign: 'center' as const,
    margin: '0',
}

const btnContainer = {
    textAlign: 'center' as const,
    marginBottom: '32px',
}

const button = {
    backgroundColor: '#f97316', // Orange-500
    borderRadius: '6px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '14px 24px',
    boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2), 0 2px 4px -1px rgba(249, 115, 22, 0.1)',
}

const hr = {
    borderColor: '#262626',
    margin: '32px 0',
}

const footer = {
    textAlign: 'center' as const,
}

const footerText = {
    fontSize: '12px',
    color: '#737373',
    margin: '0 0 12px',
}

const footerLinks = {
    fontSize: '12px',
    color: '#737373',
    margin: '0',
}

const link = {
    color: '#a3a3a3',
    textDecoration: 'underline',
}