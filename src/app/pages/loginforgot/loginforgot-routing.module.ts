import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginforgotPage } from './loginforgot.page';

const routes: Routes = [
  {
    path: '',
    component: LoginforgotPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginforgotPageRoutingModule {}
