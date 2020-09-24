import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { NetworkService } from '../../services/network.service';
import { VerprodPage } from '../verprod/verprod.page';
import { DomSanitizer } from '@angular/platform-browser';
import { BaselocalService } from '../../services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';

const PAGE_SIZE = 20;
const IMG_URL   = 'https://api.kinetik.cl/go2shop/img/';

@Component({
  selector: 'app-tabvitrina',
  templateUrl: './tabvitrina.page.html',
  styleUrls: ['./tabvitrina.page.scss'],
})
export class TabvitrinaPage implements OnInit {

  @ViewChild( IonContent, {static: true} ) content: IonContent;

  texto = '';
  promociones = [];
  productos = [];
  offset    = 0;
  buscando  = false;
  segmento = '';
  lScrollInfinito = false;
  config;

  constructor( private netWork: NetworkService,
               private modalCtrl: ModalController,
               public baseLocal: BaselocalService,
               private funciones: FuncionesService,
               public domSanitizer: DomSanitizer ) {
    // this.loadImages(0);
  }

  ngOnInit() {
    // console.log('ngOnInit');
    this.baseLocal.obtenUltimoConfig().then( data => this.config = data );
    this.baseLocal.inicializa();
    this.loadPromociones();
    this.loadImages( true );
  }

  scrollToTop() {
    this.content.scrollToTop(1500);
  }
  loadDefaultImg( event ) {
    event.target.src = 'assets/imgs/no-img.png';
  }

  async verproducto( prod ) {
    console.log(prod);
    const modal = await this.modalCtrl.create({
      component: VerprodPage,
      componentProps: { producto: prod }
    });
    await modal.present();
  }

  loadPromociones() {
    this.netWork.vitrina( this.offset, undefined, undefined, true )
      .subscribe( (res: any) => {
        // console.log('respuesta promos', res);
        try {
          res.data.forEach(element => {
            element.imagen = IMG_URL + element.imagen ;
          });
          this.buscando = false;
          this.promociones = res.data;
          //
        } catch (error) {
            this.funciones.msgAlert('', error );
        }
      });
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
    this.netWork.vitrina( this.offset, true )
      .subscribe( (res: any) => {
        // console.log('respuesta ', res);
        try {
          res.data.forEach(element => {
            element.imagen = IMG_URL + element.imagen ;
          });
          this.buscando = false;
          this.productos = this.productos.length === 0 ? res.data : [...this.productos, ...res.data];
          if (event) {
            event.target.complete();
          }
          if ( res.data.length < PAGE_SIZE ) {
            this.lScrollInfinito = false ;
          } else if ( init === true ) {
            this.lScrollInfinito = true ;
          }
        } catch (error) {
            this.funciones.msgAlert('', error );
        }
      });
    //
  }

  clickPromocion( event ) {
    console.log(event );
  }

}
