const sendJson = (res: any, status: number, body: unknown) => {
  res.status(status).setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
};

export default function handler(_req: any, res: any) {
  return sendJson(res, 410, {
    error: 'Direct photo requests are retired. Use the cached gallery API.',
    code: 'gone',
  });
}
