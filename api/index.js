// Vercel serverless function entry point
export default async function handler(req, res) {
  const app = await import('../dist/index.js');
  return app.default(req, res);
}
