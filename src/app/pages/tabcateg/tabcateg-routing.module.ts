import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabcategPage } from './tabcateg.page';

const routes: Routes = [
  {
    path: '',
    component: TabcategPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabcategPageRoutingModule {}
