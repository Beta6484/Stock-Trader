import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProposalsComponent } from './proposals.component';
import { routes } from './proposals.routes';
import { StorageService } from '../services/storage/storage.service';

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