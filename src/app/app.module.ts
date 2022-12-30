import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './components/app.component';
import {AppMaterialsModule} from './app.materials.module';
import {ToolbarComponent} from './components/toolbar/toolbar.component';
import {BlogComponent} from './components/blog/blog.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';

import {MarkdownModule} from 'ngx-markdown';
import {GraphQLModule} from './graphql.module';
import {ApolloModule} from 'apollo-angular';

@NgModule({
  declarations: [AppComponent, BlogComponent, ToolbarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    GraphQLModule,
    ApolloModule,
    AppMaterialsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
