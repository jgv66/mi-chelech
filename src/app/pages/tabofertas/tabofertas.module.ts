import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabofertasPageRoutingModule } from './tabofertas-routing.module';

import { TabofertasPage } from './tabofertas.page';
import { VerprodPage } from '../verprod/verprod.page';
import { VerprodPageModule } from '../verprod/verprod.module';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  entryComponents: [ VerprodPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabofertasPageRoutingModule,
    ComponentsModule,
    VerprodPageModule,
    ComponentsModule,
    PipesModule
  ],
  declarations: [TabofertasPage]
})
export class TabofertasPageModule {}
