import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginforgotPageRoutingModule } from './loginforgot-routing.module';

import { LoginforgotPage } from './loginforgot.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginforgotPageRoutingModule
  ],
  declarations: [LoginforgotPage]
})
export class LoginforgotPageModule {}
