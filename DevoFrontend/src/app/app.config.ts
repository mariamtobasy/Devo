import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // ⚡ Provide SocialAuthServiceConfig using the string token
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          { id: GoogleLoginProvider.PROVIDER_ID, provider: new GoogleLoginProvider('YOUR_GOOGLE_CLIENT_ID') },
          { id: FacebookLoginProvider.PROVIDER_ID, provider: new FacebookLoginProvider('YOUR_FACEBOOK_APP_ID') },
        ],
        onError: (err: any) => console.error('Social login error', err),
      } as SocialAuthServiceConfig,
    }
  ]
};
