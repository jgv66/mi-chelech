import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'domSanitizer'
})
export class DomSanitizerPipe implements PipeTransform {

  constructor( private sanitizer: DomSanitizer ) {}

  transform( img ): unknown {

    // const domImg = `background-image: url( '${ img }' )`;
    const domImg = `'${ img }'`;
    console.log( 'DomSanitizerPipe() ->', domImg );

    return this.sanitizer.bypassSecurityTrustUrl( domImg );
  }

}
