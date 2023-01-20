import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ErrorComponent } from './error/error.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-Interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { PostModule } from './post/post.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostModule,
  ],
  providers: [
    {provide : HTTP_INTERCEPTORS , useClass: AuthInterceptor, multi : true},
    {provide : HTTP_INTERCEPTORS , useClass: ErrorInterceptor, multi : true}
  ],
  bootstrap: [AppComponent],
  entryComponents : [ErrorComponent]
})
export class AppModule { }
