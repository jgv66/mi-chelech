import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabvitrinaPageRoutingModule } from './tabvitrina-routing.module';

import { TabvitrinaPage } from './tabvitrina.page';
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
    TabvitrinaPageRoutingModule,
    VerprodPageModule,
    ComponentsModule,
    PipesModule,
  ],
  declarations: [TabvitrinaPage]
})
export class TabvitrinaPageModule {}
