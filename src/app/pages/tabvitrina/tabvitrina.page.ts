import { Component, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { NetworkService } from '../../services/network.service';
import { VerprodPage } from '../verprod/verprod.page';
import { DomSanitizer } from '@angular/platform-browser';
import { BaselocalService } from '../../services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';

const PAGE_SIZE = 20;
const IMG_URL   = 'http://www.grupocaltex.cl/imagenes/fotos18/';

@Component({
  selector: 'app-tabvitrina',
  templateUrl: './tabvitrina.page.html',
  styleUrls: ['./tabvitrina.page.scss'],
})
export class TabvitrinaPage {

  @ViewChild( IonContent, {static: true} ) content: IonContent;

  promociones: { imagen: string, descrip: string, precio: number }[] = [
    { imagen: 'assets/imgs/ferr-001.png', descrip: 'Manguera Gas 1 mt Conector 3/8"' , precio: 7150 },
    { imagen: 'assets/imgs/ferr-002.png', descrip: 'Cepillo 82 mm (3-1/4) (M1902G) - Makita Mt', precio: 106550 },
    { imagen: 'assets/imgs/ferr-003.png', descrip: 'Aceite Mezcla 2 Tiempos 1000 cc - Husqvarna', precio: 10150 },
    { imagen: 'assets/imgs/ferr-004.png', descrip: 'Hacha Mango de Madera 800 gr - Uyustools', precio: 8690 },
    { imagen: 'assets/imgs/ferr-005.png', descrip: 'Cepillo de banco de 13" 2000w Prescott. 1 año de garantía', precio: 327250 },
    { imagen: 'assets/imgs/ferr-006.png', descrip: 'Taladro atornillador 18v inalámbrico 2 bats. de litio. 1 año de garantía', precio: 83283 },
  ];

  texto = '';
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
    this.loadImages(0);
  }

  ngOnInit() {
    // console.log('ngOnInit');
    this.baseLocal.obtenUltimoConfig().then( data => this.config = data );
    this.baseLocal.inicializa();
    this.loadImages( true );
  }

  scrollToTop() {
    this.content.scrollToTop(1500);
  }
  loadDefaultImg( event ) {
    event.target.src = 'assets/imgs/no-img.png';
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
    this.netWork.vitrina( this.offset, true )
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
