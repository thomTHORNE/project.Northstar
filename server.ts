import { serve } from "https://deno.land/std@0.198.0/http/server.ts";

const CLIENT_ID = Deno.env.get("CLIENT_ID")!;
const CLIENT_SECRET = Deno.env.get("CLIENT_SECRET")!;
const TOKEN_ENDPOINT = "https://tidal.com/oauth2/token";
const REDIRECT_URI = "http://localhost:3000/callback";

async function exchangeCode(request: Request): Promise<Response> {
    const { code } = await request.json();

    if (!code) {
        return new Response(JSON.stringify({ error: "Authorization code is required" }), { status: 400 });
    }

    try {
        const body = new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        });

        const tokenResponse = await fetch(TOKEN_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });

        if (!tokenResponse.ok) {
            throw new Error(`Failed to exchange code: ${await tokenResponse.text()}`);
        }

        const { access_token, refresh_token, expires_in } = await tokenResponse.json();
        return new Response(
            JSON.stringify({ accessToken: access_token, refreshToken: refresh_token, expiresIn: expires_in }),
            { headers: { "Content-Type": "application/json" } },
        );
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Failed to exchange authorization code" }), { status: 500 });
    }
}

serve(async (req) => {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/exchange-code") {
        return exchangeCode(req);
    }

    return new Response("Not Found", { status: 404 });
}, { port: 4000 });
