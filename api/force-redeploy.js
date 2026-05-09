export default function handler() {
  return new Response(JSON.stringify({
    message: 'Force redeploy triggered',
    timestamp: new Date().toISOString(),
    commit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
