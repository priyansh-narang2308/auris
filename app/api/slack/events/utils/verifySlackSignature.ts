import crypto from 'crypto'


/**
 * Verifies the authenticity of incoming Slack requests by validating the HMAC signature
 * using the application's signing secret and checking the request timestamp.
 */

export function verifySlackSignature(body: string, signature: string, timestamp: string) {

    const signingSecret = process.env.SLACK_SIGNING_SECRET!
    const timee = Math.floor(new Date().getTime() / 1000)

    if (Math.abs(timee - parseInt(timestamp)) > 300) {
        return false
    }

    const signatureBaseString = `v0:${timestamp}:${body}`

    const mySignature = 'v0=' + crypto
        .createHmac('sha256', signingSecret)
        .update(signatureBaseString, 'utf8')
        .digest('hex')

    return crypto.timingSafeEqual(
        Buffer.from(mySignature, 'utf8'),
        Buffer.from(signature, 'utf8')
    )

}