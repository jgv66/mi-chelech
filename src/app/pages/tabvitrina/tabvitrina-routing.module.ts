import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabvitrinaPage } from './tabvitrina.page';

const routes: Routes = [
  {
    path: '',
    component: TabvitrinaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabvitrinaPageRoutingModule {}
