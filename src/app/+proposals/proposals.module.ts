import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProposalsComponent } from './proposals.component';
import { routes } from './proposals.routes';

@NgModule({
  declarations: [
    ProposalsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})

export class ProposalsModule {}