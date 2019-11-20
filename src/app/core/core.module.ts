import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap';
import { AlertComponent } from './alert/alert.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule,
    AlertModule.forRoot()
  ]
})

export class CoreModule {}