const SUPABASE_REST_PATH = '/rest/v1';

export class MissingServerConfigError extends Error {
  constructor() {
    super('Supabase server configuration is incomplete.');
    this.name = 'MissingServerConfigError';
  }
}

export class DatabaseRequestError extends Error {
  readonly status?: number;

  constructor(operation: string, status?: number) {
    super(`Supabase ${operation} failed.`);
    this.name = 'DatabaseRequestError';
    this.status = status;
  }
}

const serverConfig = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new MissingServerConfigError();

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'https:') throw new Error('Supabase URL must use HTTPS.');
  } catch {
    throw new MissingServerConfigError();
  }

  return {
    key,
    url: url.replace(/\/$/, ''),
  };
};

const publicConfig = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) throw new MissingServerConfigError();

  return { key, url: url.replace(/\/$/, '') };
};

const databaseFetch = async (
  config: { url: string; key: string },
  path: string,
  init: RequestInit,
  operation: string,
  includeBearer: boolean
) => {
  let response: Response;
  try {
    response = await fetch(`${config.url}${SUPABASE_REST_PATH}${path}`, {
      ...init,
      headers: {
        apikey: config.key,
        ...(includeBearer ? { authorization: `Bearer ${config.key}` } : {}),
        'content-type': 'application/json',
        prefer: 'return=representation',
        ...(init.headers || {}),
      },
    });
  } catch {
    console.error(`[supabase] ${operation} network request failed.`);
    throw new DatabaseRequestError(operation);
  }
  if (!response.ok) {
    console.error(`[supabase] ${operation} failed with status ${response.status}.`);
    throw new DatabaseRequestError(operation, response.status);
  }
  return response;
};

export const supabaseFetch = async (
  path: string,
  init: RequestInit = {},
  operation = 'request'
) => {
  const config = serverConfig();
  const isModernSecret = config.key.startsWith('sb_secret_');
  return databaseFetch(config, path, init, operation, !isModernSecret);
};

export const supabasePublicFetch = async (
  path: string,
  init: RequestInit = {},
  operation = 'public request'
) => databaseFetch(publicConfig(), path, init, operation, true);

export const backendErrorResponse = (error: unknown, fallback: string) => {
  if (error instanceof MissingServerConfigError) {
    console.error('[supabase] Server configuration is incomplete.');
    return {
      status: 503,
      body: { error: 'Service is not configured.', code: 'missing-config' },
    };
  }

  if (error instanceof DatabaseRequestError) {
    return {
      status: 502,
      body: { error: 'Database service request failed.', code: 'database-error' },
    };
  }

  console.error(`[backend] ${fallback}`);
  return {
    status: 500,
    body: { error: fallback, code: 'internal-error' },
  };
};
