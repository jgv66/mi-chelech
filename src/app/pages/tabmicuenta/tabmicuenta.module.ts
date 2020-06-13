import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabmicuentaPageRoutingModule } from './tabmicuenta-routing.module';

import { TabmicuentaPage } from './tabmicuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabmicuentaPageRoutingModule
  ],
  declarations: [TabmicuentaPage]
})
export class TabmicuentaPageModule {}
