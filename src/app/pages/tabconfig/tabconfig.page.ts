import { Component, OnInit, ViewChild } from '@angular/core';
import { NetworkService } from '../../services/network.service';
import { IonContent, ModalController } from '@ionic/angular';
import { VerprodPage } from '../verprod/verprod.page';
import { FuncionesService } from '../../services/funciones.service';

const PAGE_SIZE = 20;
const IMG_URL   = 'http://www.grupocaltex.cl/imagenes/fotos18/';

@Component({
  selector: 'app-tabconfig',
  templateUrl: './tabconfig.page.html',
  styleUrls: ['./tabconfig.page.scss'],
})
export class TabconfigPage implements OnInit {

  @ViewChild( IonContent, {static: true} ) content: IonContent;

  categorias = [];
  imageList = [];
  offset    = 0;
  texto     = '';
  buscando  = false;
  lScrollInfinito = false;
  segmento;

  constructor( private netWork: NetworkService,
               private modalCtrl: ModalController,
               private funciones: FuncionesService ) { }

  ngOnInit() {
    this.netWork.categorias()
      .subscribe( (datos: any) => {
        this.categorias = datos.data;
      });
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
    return await modal.present();
  }

  segmentChanged(event) {
    const valorSegmento = event.detail.value;
    if ( valorSegmento === 'todos' ) {
      this.segmento = '';
      return;
    }
    this.segmento = valorSegmento;
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
          if ( res.data < PAGE_SIZE ) {
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
      });
    //
  }
  masDatos( infiniteScroll: any ) {
    this.loadImages( false, infiniteScroll );
  }

}
