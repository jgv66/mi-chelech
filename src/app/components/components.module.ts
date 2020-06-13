import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SlideshowBackdropComponent } from './slideshow-backdrop/slideshow-backdrop.component';

@NgModule({
  declarations: [SlideshowBackdropComponent],
  exports: [SlideshowBackdropComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class ComponentsModule { }
