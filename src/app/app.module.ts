import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
    GoogleApiModule,
    GoogleApiService,
    GoogleAuthService,
    NgGapiClientConfig,
    NG_GAPI_CONFIG,
    GoogleApiConfig
} from "ng-gapi";

import { CONFIGURATION } from './configuration';
import { YoutubeService } from './yt.service';
import { UserService } from './user.service';

let gapiClientConfig: NgGapiClientConfig = {
    client_id: CONFIGURATION.CLIENT_ID,
    discoveryDocs: ["https://analyticsreporting.googleapis.com/$discovery/rest?version=v4"],
    ux_mode: "popup",
    scope: [
        "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube",
    ].join(" ")
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    GoogleApiModule.forRoot({
     provide: NG_GAPI_CONFIG,
     useValue: gapiClientConfig
   }),
   HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    UserService,
    YoutubeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
