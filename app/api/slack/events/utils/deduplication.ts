declare global {
    var processedEvents: Set<string> | undefined

}

// Note: Generated With AI 🙏
/**
 * This utility provides a mechanism to deduplicate incoming Slack events.
 * 
 * Slack's Event API may retry delivery if the endpoint does not respond within 3 seconds,
 * which can lead to the same event being processed multiple times. This module tracks
 * unique event identifiers in a global memory store to ensure idempotency.
 * 
 * @example
 * const { event_id, event_ts } = slackEvent;
 * 
 * if (isDuplicateEvent(event_id, event_ts)) {
 *   console.log(`Skipping duplicate event: ${event_id}`);
 *   return;
 * }
 * 
 * // Proceed with event processing...
 */

export function isDuplicateEvent(eventId: string, eventTs: string) {

    const uniqueId = `${eventId}-${eventTs}`

    if (!global.processedEvents) {
        global.processedEvents = new Set()
    }

    if (global.processedEvents.has(uniqueId)) {
        return true
    }

    global.processedEvents.add(uniqueId)

    setTimeout(() => {
        global.processedEvents?.delete(uniqueId)
    }, 60 * 60 * 1000);

    return false
}