import { Component, ViewChild, OnInit } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { NetworkService } from '../../services/network.service';
import { VerprodPage } from '../verprod/verprod.page';
import { DomSanitizer } from '@angular/platform-browser';
import { BaselocalService } from '../../services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';

const PAGE_SIZE = 20;
const IMG_URL   = 'http://www.grupocaltex.cl/imagenes/fotos18/';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  @ViewChild( IonContent, {static: true} ) content: IonContent;

  productos = [];
  offset    = 0;
  buscando  = false;
  lScrollInfinito = false;

  constructor( private netWork: NetworkService,
               private modalCtrl: ModalController,
               public baseLocal: BaselocalService,
               private funciones: FuncionesService,
               public domSanitizer: DomSanitizer ) {
    this.loadImages(0);
  }

  ngOnInit() {
    this.loadImages( true );
  }

  scrollToTop() {
    this.content.scrollToTop(1500);
  }

  async verproducto( prod ) {
    const modal = await this.modalCtrl.create({
      component: VerprodPage,
      componentProps: { producto: prod }
    });
    await modal.present();
  }

  loadImages(init, event?) {
    //
    if ( init === true ) {
      this.buscando = true;
      this.offset   = 0 ;
      this.lScrollInfinito = true;
    } else {
      this.offset += PAGE_SIZE ;
    }
    //
    this.netWork.vitrina( this.offset, null, true )
      .subscribe( (res: any) => {
        // console.log('respuesta ', res);
        try {
          res.data.forEach(element => {
            element.codigosincolor = IMG_URL + element.codigosincolor ;
          });
          this.buscando = false;
          this.productos = this.productos.length === 0 ? res.data : [...this.productos, ...res.data];
          if (event) {
            event.target.complete();
          }
          if ( res.data < PAGE_SIZE ) {
            this.lScrollInfinito = false ;
          } else if ( init === true ) {
            this.lScrollInfinito = true ;
          }
          } catch (error) {
            this.funciones.msgAlert('', error);
          }
      });
    //
  }

}
