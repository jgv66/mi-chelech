import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerprodPageRoutingModule } from './verprod-routing.module';

import { VerprodPage } from './verprod.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerprodPageRoutingModule
  ],
  declarations: [VerprodPage]
})
export class VerprodPageModule {}
