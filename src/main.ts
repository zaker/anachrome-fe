import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/components/app.component';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from "apollo-angular/http";
import { InMemoryCache } from '@apollo/client/core';
import { inject } from '@angular/core';
import { provideMarkdown } from 'ngx-markdown';

if (environment.production) {
  enableProdMode();
}
const uri = "https://anachro.me/api/gql";

bootstrapApplication(AppComponent, {

  providers: [
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideMarkdown(),
    provideApollo(() => {
      const httpLink: HttpLink = inject(HttpLink);

      return {
        link: httpLink.create({ uri: uri }),
        cache: new InMemoryCache(),
      };
    })
  ]
})
  .catch((err) => console.error(err));
