import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TabconfigPageRoutingModule } from './tabconfig-routing.module';

import { TabconfigPage } from './tabconfig.page';
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
    TabconfigPageRoutingModule,
    VerprodPageModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [TabconfigPage]
})
export class TabconfigPageModule {}
