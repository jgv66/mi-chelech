import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BaselocalService } from '../../services/baselocal.service';

@Component({
  selector: 'app-verprod',
  templateUrl: './verprod.page.html',
  styleUrls: ['./verprod.page.scss'],
})
export class VerprodPage implements OnInit {

  @Input() producto;
  prod: any;

  constructor( private modalCtrl: ModalController,
               public baseLocal: BaselocalService ) {}

  ngOnInit() {
    this.prod = { codigo:      this.producto.codigo,
                  descripcion: this.producto.descripcion,
                  apedir:      1,
                  precio:      this.producto.precio,
                  listaprecio: this.producto.listaprecio,
                  metodolista: this.producto.metodolista,
                  imagen:      this.producto.codigosincolor
                };
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  agregarAlCarro() {
    this.baseLocal.Add2Cart( this.prod );
    this.salir();
  }

}
