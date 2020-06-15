import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabbuscarPage } from './tabbuscar.page';

const routes: Routes = [
  {
    path: '',
    component: TabbuscarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabbuscarPageRoutingModule {}
