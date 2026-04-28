// supabase/functions/shared/cors.ts
// Enhanced CORS handler for all edge functions
// Works with: openai-client, huggingface-client, ai-service

// ============================================
// CORS HEADERS
// ============================================

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
  'Access-Control-Allow-Credentials': 'true',
};

// ============================================
// CORS PREFLIGHT HANDLER
// ============================================

/**
 * Handle CORS preflight requests
 * Returns null if it's not a preflight request (so you can continue processing)
 */
export function handleCors(req: Request): Response | null {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: corsHeaders,
      status: 204, // No Content - standard for OPTIONS
    });
  }
  
  // Not a preflight request, continue processing
  return null;
}

// ============================================
// RESPONSE HELPERS
// ============================================

/**
 * Create a successful JSON response with CORS headers
 */
export function successResponse(data: any, status = 200): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Create an error JSON response with CORS headers
 */
export function errorResponse(message: string, status = 500, details?: any): Response {
  const errorBody: any = {
    error: message,
    timestamp: new Date().toISOString(),
  };
  
  if (details) {
    errorBody.details = details;
  }
  
  return new Response(
    JSON.stringify(errorBody),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Create a streaming response with CORS headers
 * Useful for AI streaming responses
 */
export function streamingResponse(
  stream: ReadableStream,
  contentType = 'text/event-stream'
): Response {
  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

/**
 * Create a file download response with CORS headers
 */
export function fileResponse(
  data: Uint8Array | string,
  filename: string,
  contentType: string
): Response {
  return new Response(data, {
    headers: {
      ...corsHeaders,
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Common error types for consistent error handling
 */
export enum ErrorType {
  VALIDATION = 'validation_error',
  AUTHENTICATION = 'authentication_error',
  AUTHORIZATION = 'authorization_error',
  NOT_FOUND = 'not_found',
  RATE_LIMIT = 'rate_limit',
  AI_SERVICE = 'ai_service_error',
  DATABASE = 'database_error',
  INTERNAL = 'internal_error',
}

/**
 * Create a typed error response
 */
export function typedErrorResponse(
  type: ErrorType,
  message: string,
  status = 500,
  details?: any
): Response {
  const errorBody = {
    error: {
      type,
      message,
      timestamp: new Date().toISOString(),
    },
  };
  
  if (details) {
    errorBody.error = { ...errorBody.error, ...details };
  }
  
  return new Response(
    JSON.stringify(errorBody),
    {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    }
  );
}

// ============================================
// AI-SPECIFIC ERROR HELPERS
// ============================================

/**
 * Handle OpenAI specific errors
 */
export function openAIErrorResponse(error: any): Response {
  let status = 500;
  let message = 'AI service error';
  let details = {};
  
  if (error?.status) {
    status = error.status;
  }
  
  if (error?.message) {
    message = error.message;
  }
  
  if (error?.error) {
    details = error.error;
  }
  
  // Handle rate limiting
  if (status === 429) {
    return typedErrorResponse(
      ErrorType.RATE_LIMIT,
      'AI service rate limit reached. Please try again later.',
      429,
      { retryAfter: error?.headers?.['retry-after'] || '60' }
    );
  }
  
  // Handle authentication errors
  if (status === 401 || status === 403) {
    return typedErrorResponse(
      ErrorType.AUTHENTICATION,
      'AI service authentication failed. Check API keys.',
      401
    );
  }
  
  return typedErrorResponse(
    ErrorType.AI_SERVICE,
    message,
    status,
    details
  );
}

/**
 * Handle HuggingFace specific errors
 */
export function huggingFaceErrorResponse(error: any): Response {
  let status = 500;
  let message = 'HuggingFace service error';
  
  if (error?.status) {
    status = error.status;
  }
  
  if (error?.message) {
    message = error.message;
  }
  
  // HuggingFace specific errors
  if (status === 503) {
    message = 'HuggingFace model is loading. Please retry in a few seconds.';
  }
  
  if (status === 429) {
    message = 'HuggingFace rate limit reached. Using fallback processing.';
  }
  
  return typedErrorResponse(
    ErrorType.AI_SERVICE,
    message,
    status
  );
}

/**
 * Handle AI service fallback gracefully
 */
export function aiFallbackResponse(
  originalService: string,
  fallbackService: string,
  result: any
): Response {
  return successResponse({
    data: result,
    meta: {
      service_used: fallbackService,
      original_service: originalService,
      fallback_triggered: true,
      timestamp: new Date().toISOString(),
    },
  });
}

// ============================================
// REQUEST VALIDATION
// ============================================

/**
 * Parse and validate JSON request body
 */
export async function parseJSONBody(req: Request): Promise<any> {
  try {
    const body = await req.json();
    return body;
  } catch (error) {
    throw new Error('Invalid JSON in request body');
  }
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): string | null {
  for (const field of requiredFields) {
    if (!body[field]) {
      return `Missing required field: ${field}`;
    }
  }
  return null;
}

// ============================================
// SECURITY HELPERS
// ============================================

/**
 * Extract and validate API key from request
 */
export function extractApiKey(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check x-api-key header
  const apiKeyHeader = req.headers.get('x-api-key');
  if (apiKeyHeader) {
    return apiKeyHeader;
  }
  
  return null;
}

/**
 * Check if request is from Supabase dashboard (admin)
 */
export function isSupabaseAdmin(req: Request): boolean {
  const serviceKey = req.headers.get('authorization');
  return serviceKey?.includes('service_role') || false;
}

// ============================================
// LOGGING HELPERS
// ============================================

/**
 * Log request details for debugging
 */
export function logRequest(
  functionName: string,
  req: Request,
  extra?: Record<string, any>
): void {
  const logData = {
    function: functionName,
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
    timestamp: new Date().toISOString(),
    ...extra,
  };
  
  console.log(`📥 [${functionName}] Request:`, JSON.stringify(logData, null, 2));
}

/**
 * Log response details for debugging
 */
export function logResponse(
  functionName: string,
  status: number,
  extra?: Record<string, any>
): void {
  const logData = {
    function: functionName,
    status,
    timestamp: new Date().toISOString(),
    ...extra,
  };
  
  const emoji = status >= 400 ? '❌' : '✅';
  console.log(`${emoji} [${functionName}] Response:`, JSON.stringify(logData, null, 2));
}

// ============================================
// PERFORMANCE HELPERS
// ============================================

/**
 * Measure execution time of a function
 */
export function measurePerformance(): {
  start: () => void;
  end: () => number;
} {
  let startTime: number;
  
  return {
    start: () => {
      startTime = performance.now();
    },
    end: () => {
      const endTime = performance.now();
      return endTime - startTime;
    },
  };
}

// ============================================
// RESPONSE TEMPLATES
// ============================================

/**
 * Create a paginated response
 */
export function paginatedResponse(
  data: any[],
  page: number,
  limit: number,
  total: number
): Response {
  return successResponse({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  });
}

/**
 * Create a health check response
 */
export function healthCheckResponse(
  services: Record<string, boolean>
): Response {
  return successResponse({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services,
  });
}

/**
 * Create a rate limit response
 */
export function rateLimitResponse(
  retryAfterSeconds: number = 60
): Response {
  return new Response(
    JSON.stringify({
      error: {
        type: ErrorType.RATE_LIMIT,
        message: 'Too many requests. Please try again later.',
        retryAfter: retryAfterSeconds,
      },
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSeconds),
      },
    }
  );
}