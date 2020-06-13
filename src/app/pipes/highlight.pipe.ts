import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'highLight'})

export class HighlightPipe implements PipeTransform {

  transform(text: string, search): string {
    try {
        if ( text && search && ( text !== undefined || search !== undefined ) && search !== undefined )  {
            text = text.toString(); // sometimes comes in as number
            search = search.trim();
            if (search.length > 0) {
                let pattern = search.trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
                pattern = pattern.split(' ').filter((t) => {
                    return t.length > 0;
                }).join('|');
                const regex = new RegExp(pattern, 'gi');
                text = text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
                // text = text.replace(regex, (match) => `<span style="background-color: #ffc409 !important;">${match}</span>`);
            }
        }
    }
    catch (exception) {
        console.error('error in highlight:', exception);
    }
    // console.log(text);
    return text;
  }

}
