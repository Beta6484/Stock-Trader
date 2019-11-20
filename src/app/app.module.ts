import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap';
import { AppComponent } from './app.component';
import { ROUTES } from './app.routes';
import { fakeBackendUsersProvider } from './backend/fake-backend-users.interceptor';
import { CoreModule } from './core/core.module';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    MainLayoutComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    ModalModule.forRoot(),
    RouterModule.forRoot(ROUTES, {
      useHash: true
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    fakeBackendUsersProvider,
    Title
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule {}