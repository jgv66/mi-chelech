import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabconfigPage } from './tabconfig.page';

const routes: Routes = [
  {
    path: '',
    component: TabconfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabconfigPageRoutingModule {}
