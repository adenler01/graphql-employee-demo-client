import { Page2Component } from './../pages/page2/page2.component';
import { environment } from './../environments/environment.prod';
import { HomeComponent } from './../pages/home/home.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { ApolloClient, createBatchingNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';

import { AppComponent } from './app.component';

// Create the client as outlined above
const client = new ApolloClient({
  networkInterface: createBatchingNetworkInterface({
    uri: environment.graphUrl,
    batchInterval: 10
  }),
});

export function provideClient(): ApolloClient {
  return client;
}

/** routing */
const appRoutes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
    {
    path: 'page2',
    component: Page2Component
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    Page2Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ApolloModule.forRoot(provideClient),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
