import { Component, ViewChild } from '@angular/core';
import { NetworkService } from '../../services/network.service';
import { IonContent, ModalController } from '@ionic/angular';
import { VerprodPage } from '../verprod/verprod.page';
import { FuncionesService } from '../../services/funciones.service';

const PAGE_SIZE = 20;
const IMG_URL   = 'http://www.grupocaltex.cl/imagenes/fotos18/';

@Component({
  selector: 'app-tabbuscar',
  templateUrl: './tabbuscar.page.html',
  styleUrls: ['./tabbuscar.page.scss'],
})
export class TabbuscarPage {

  @ViewChild( IonContent, {static: true} ) content: IonContent;

  categorias = [];
  imageList = [];
  offset    = 0;
  texto     = '';
  buscando  = false;
  lScrollInfinito = false;

  constructor( private netWork: NetworkService,
               private modalCtrl: ModalController,
               private funciones: FuncionesService ) { }

  scrollToTop() {
    this.content.scrollToTop(1500);
  }

  async verproducto( prod ) {
    const modal = await this.modalCtrl.create({
      component: VerprodPage,
      componentProps: { producto: prod }
    });
    return await modal.present();
  }

  buscar() {
    if ( this.texto !== '' ) {
      this.imageList = [];
      this.lScrollInfinito = true;
      this.loadImages( true );
    } else {
      this.funciones.msgAlert('', 'Debe ingresar algún dato para buscar.' );
    }
  }

  loadImages(init, event?) {
    //
    if ( init === true ) {
      this.offset   = 0 ;
    } else {
      this.offset += PAGE_SIZE ;
    }
    this.buscando = true;
    //
    this.netWork.buscarProductos( this.texto, this.offset )
      .subscribe( (res: any) => {
        // console.log('respuesta ', res);
        try {
          res.data.forEach(element => {
            element.codigosincolor = IMG_URL + element.codigosincolor ;
          });
          this.buscando = false;
          if ( res.data.length > 0 ) {
            //
            this.imageList = this.imageList.length === 0 ? res.data : [...this.imageList, ...res.data];
            if (event) {
              event.target.complete();
            }
            //
            if ( res.data.length < PAGE_SIZE ) {
              this.lScrollInfinito = false ;
            } else if ( init === true ) {
              this.lScrollInfinito = true ;
            }
            //
          } else {
            this.buscando = false;
            this.lScrollInfinito = false ;
            if ( this.imageList.length === 0 ) {
              this.funciones.msgAlert('', 'No existen productos con ese nombre o descripción o código. Corrija y reintente.' );
            }
          }
        } catch (error) {
          this.funciones.msgAlert('', error );
        }
      });
    //
  }
  masDatos( infiniteScroll: any ) {
    this.loadImages( false, infiniteScroll );
  }

}
