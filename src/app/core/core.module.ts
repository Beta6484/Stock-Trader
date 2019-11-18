import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap';
import { AlertComponent } from './alert/alert.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    HeaderComponent, 
    FooterComponent,
    AlertComponent
  ],
  exports: [
    HeaderComponent, 
    FooterComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    AlertModule.forRoot()
  ]
})

export class CoreModule {}