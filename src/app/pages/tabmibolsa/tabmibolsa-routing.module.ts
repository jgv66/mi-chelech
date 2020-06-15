import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabmibolsaPage } from './tabmibolsa.page';

const routes: Routes = [
  {
    path: '',
    component: TabmibolsaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabmibolsaPageRoutingModule {}
