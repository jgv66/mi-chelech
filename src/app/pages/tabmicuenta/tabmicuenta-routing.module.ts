import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabmicuentaPage } from './tabmicuenta.page';

const routes: Routes = [
  {
    path: '',
    component: TabmicuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabmicuentaPageRoutingModule {}
