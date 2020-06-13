import { Component } from '@angular/core';
import { BaselocalService } from '../../services/baselocal.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor( public baseLocal: BaselocalService ) {}

}
