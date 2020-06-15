import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogincrearPage } from './logincrear.page';

const routes: Routes = [
  {
    path: '',
    component: LogincrearPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogincrearPageRoutingModule {}
