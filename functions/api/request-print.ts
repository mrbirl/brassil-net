// TODO: implement print-request handler
// - Validate input with Zod
// - Verify Cloudflare Turnstile token
// - Send order details email via Resend
// - Return JSON response

export const onRequestPost: PagesFunction = async (_context) => {
  return new Response(JSON.stringify({ error: 'Not implemented yet' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' },
  });
};
