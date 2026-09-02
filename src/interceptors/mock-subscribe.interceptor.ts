import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { of } from 'rxjs';

/**
 * Returns a local success response for the newsletter endpoint during development.
 * This prevents `ng serve` from proxying `/api/subscribe` to the unavailable .NET backend.
 */
export const mockSubscribeInterceptor: HttpInterceptorFn = (req, next) => {
  const isLocalHost = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );

  if (
    !isLocalHost ||
    req.method !== 'POST' ||
    !req.url.endsWith('/api/subscribe')
  ) {
    return next(req);
  }

  const body = req.body as { email?: string } | null | undefined;
  const email = body?.email;

  if (!email) {
    return of(
      new HttpResponse({
        status: 400,
        body: { error: 'Email is required' },
      })
    );
  }

  return of(
    new HttpResponse({
      status: 200,
      body: {
        success: true,
        message: 'Subscribed successfully! Welcome catalogue email dispatched (local development mock)',
      },
    })
  );
};