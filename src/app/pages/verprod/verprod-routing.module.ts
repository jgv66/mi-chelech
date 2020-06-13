import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerprodPage } from './verprod.page';

const routes: Routes = [
  {
    path: '',
    component: VerprodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerprodPageRoutingModule {}
