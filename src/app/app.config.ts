import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { DropdownModule, SidebarModule } from '@coreui/angular';
import {
  Router,
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { IconSetService } from '@coreui/icons-angular';
import { httpInterceptor } from '@app/interceptors/http.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { routes } from '@app/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    provideAnimations(),
    provideToastr({
      messageClass: 'toastr-message-class',
    }), // Toastr providers    
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
  ],
};
