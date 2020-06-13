import { NgModule } from '@angular/core';
import { FiltroPipe } from './filtro.pipe';
import { DomSanitizerPipe } from './dom-sanitizer.pipe';
import { HighlightPipe } from './highlight.pipe';

@NgModule({
  declarations: [FiltroPipe, DomSanitizerPipe, HighlightPipe],
  exports: [FiltroPipe, DomSanitizerPipe, HighlightPipe]
})
export class PipesModule { }
