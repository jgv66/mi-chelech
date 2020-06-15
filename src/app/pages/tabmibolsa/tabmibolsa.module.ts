import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabmibolsaPageRoutingModule } from './tabmibolsa-routing.module';

import { TabmibolsaPage } from './tabmibolsa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabmibolsaPageRoutingModule
  ],
  declarations: [TabmibolsaPage]
})
export class TabmibolsaPageModule {}
