import type { RequestEvent } from "@sveltejs/kit";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";

export async function GET(req: RequestEvent) {
    const token = req.request.headers.get('Authorization')?.split(' ')[1];
    const searchParams = new URL(req.request.url).searchParams;
    const channel = searchParams.get('channel');
    const message = searchParams.get('msg');

    if (!token) {
        return new Response(`Hey mate, you kinda need to like provide a token to access this endpoint..`, {
            status: 401,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    } else if (!channel || !message) {
        return new Response(`How the hell did you even do this- (Missing query data [CH: ${channel} MSG: ${message}])`, {
            status: 400,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

    const rest = new REST({ version: '10' }).setToken(token);

    const response = await rest.get(Routes.channelMessage(channel, message), {
        headers: {
            'Authorization': `Bot ${token}`
        }
    });

    return new Response(JSON.stringify(response, null, 4), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function PATCH(req: RequestEvent) {
    const token = req.request.headers.get('Authorization')?.split(' ')[1];
    const searchParams = new URL(req.request.url).searchParams;
    const channel = searchParams.get('channel');
    const message = searchParams.get('msg');

    if (!token) {
        return new Response(`Hey mate, you kinda need to like provide a token to access this endpoint..`, {
            status: 401,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    } else if (!channel || !message) {
        return new Response(`How the hell did you even do this- (Missing query data [CH: ${channel} MSG: ${message}])`, {
            status: 400,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

    const rest = new REST({ version: '10' }).setToken(token);

    const incomingBody = await req.request.json();

    const response = await rest.patch(Routes.channelMessage(channel, message), {
        body: incomingBody,
        headers: {
            'Authorization': `Bot ${token}`
        }
    });

    return new Response(JSON.stringify(response), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export async function POST(req: RequestEvent) {
    const token = req.request.headers.get('Authorization')?.split(' ')[1];
    const searchParams = new URL(req.request.url).searchParams;
    const channel = searchParams.get('channel');

    if (!token) {
        return new Response(`Hey mate, you kinda need to like provide a token to access this endpoint..`, {
            status: 401,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    } else if (!channel) {
        return new Response(`How the hell did you even do this- (Missing query data [CH: ${channel}])`, {
            status: 400,
            headers: {
                'Content-Type': 'text/plain'
            }
        })
    }

    const rest = new REST({ version: '10' }).setToken(token);

    const incomingBody = await req.request.json();

    const response = await rest.post(Routes.channelMessages(channel), {
        body: incomingBody,
        headers: {
            'Authorization': `Bot ${token}`
        }
    });

    return new Response(JSON.stringify(response), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}