import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogincrearPageRoutingModule } from './logincrear-routing.module';

import { LogincrearPage } from './logincrear.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogincrearPageRoutingModule
  ],
  declarations: [LogincrearPage]
})
export class LogincrearPageModule {}
