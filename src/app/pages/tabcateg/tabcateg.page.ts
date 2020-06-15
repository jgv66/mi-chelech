import { Component, OnInit, ViewChild } from '@angular/core';
import { NetworkService } from '../../services/network.service';
import { ModalController, IonSegment, IonContent } from '@ionic/angular';
import { VerprodPage } from '../verprod/verprod.page';
import { FuncionesService } from '../../services/funciones.service';

const PAGE_SIZE = 20;
const IMG_URL   = 'http://www.grupocaltex.cl/imagenes/fotos18/';

@Component({
  selector: 'app-tabcateg',
  templateUrl: './tabcateg.page.html',
  styleUrls: ['./tabcateg.page.scss'],
})
export class TabcategPage implements OnInit {

  @ViewChild( IonSegment, {static: true} ) segment: IonSegment;
  @ViewChild( IonContent, {static: true} ) content: IonContent;

  categorias = [];
  imageList = [];
  offset    = 0;
  texto     = '';
  buscando  = false;
  lScrollInfinito = false;
  segmento  = 'todos';

  constructor( private netWork: NetworkService,
               private modalCtrl: ModalController,
               private funciones: FuncionesService ) { }

  ngOnInit() {
    this.netWork.categorias()
      .subscribe( (datos: any) => {
        this.categorias    = datos.data;
        this.segment.value = datos.data[0].codigo;
        this.segmento      = datos.data[0].codigo;
      });
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
    return await modal.present();
  }

  segmentChanged(event) {
    const valorSegmento = event.detail.value;
    this.segmento = valorSegmento;
    this.loadImages( true );
    this.imageList = [];
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
    // console.log(this.segmento);
    this.netWork.buscarProdCategoria( this.segmento, this.offset )
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
