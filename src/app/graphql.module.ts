import { NgModule, inject } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { provideHttpClient } from '@angular/common/http';

const uri = 'https://anachro.me/api/gql';


@NgModule({
  providers: [
    provideHttpClient(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      // provide: APOLLO_OPTIONS,
      // useFactory: createApollo,
      // deps: [HttpLink],
      return {
        link: httpLink.create({ uri: uri }),
        cache: new InMemoryCache(),
      };
    })
  ],
})
export class GraphQLModule { }
