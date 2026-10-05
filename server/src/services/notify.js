// telling me a client asked for something, with a message in Slack
// it only does anything when SLACK_WEBHOOK_URL is set (api.slack.com/apps > Incoming Webhooks).
// without it the request box works the same, i just have to look at the portal myself

// Slack reads < > & as the start of links and @mentions. a client's words are only ever words,
// so these three get swapped for their harmless versions before going in the message
function plain(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** never throws. a Slack hiccup must not turn into "your request failed" for the client */
export async function notifyNewRequest(account, request) {
    const url = process.env.SLACK_WEBHOOK_URL;
    if (!url) return;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: `New request from *${plain(account.businessName)}*:\n${plain(request.message)}` }),
            // don't keep the client waiting on Slack
            signal: AbortSignal.timeout(3000)
        });
        if (!response.ok) console.error(`Slack answered ${response.status} to the new-request message.`);
    } catch (error) {
        console.error(`Could not reach Slack: ${error.message}`);
    }
}
