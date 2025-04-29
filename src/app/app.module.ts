import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './components/app.component';
import { AppMaterialsModule } from './app.materials.module';
import { BlogComponent } from './components/blog/blog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GraphQLModule } from './graphql.module';
import { MarkdownModule } from 'ngx-markdown';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

@NgModule({
    declarations: [AppComponent, BlogComponent, ToolbarComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        FooterComponent,
        FormsModule,
        GraphQLModule,
        AppMaterialsModule,
        MatIconModule,
        MatNativeDateModule,
        MatListModule,
        ReactiveFormsModule,
        MarkdownModule.forRoot(),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
        })], providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
