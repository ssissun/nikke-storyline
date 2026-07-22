import { BUILD_ID } from '../buildId';

export const GET = () =>
  new Response(JSON.stringify({ buildId: BUILD_ID }), {
    headers: { 'Content-Type': 'application/json' },
  });
