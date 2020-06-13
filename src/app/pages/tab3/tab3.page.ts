import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkService } from '../../services/network.service';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  grabando = false;

  constructor( public baseLocal: BaselocalService,
               private netWork: NetworkService,
               private funciones: FuncionesService,
               private alertCtrl: AlertController ) {}

  agregar( item ) {
    const posicion = this.baseLocal.miCarrito.findIndex( it => it.codigo === item.codigo );
    this.baseLocal.miCarrito[posicion].cantidad += 1;
  }

  quitar( item ) {
    const posicion = this.baseLocal.miCarrito.findIndex( it => it.codigo === item.codigo );
    if ( this.baseLocal.miCarrito[posicion].cantidad === 1 ) {
      this.eliminar( item );
    } else {
      this.baseLocal.miCarrito[posicion].cantidad -= 1;
    }
  }

  async eliminar( item ) {
    const alert = await this.alertCtrl.create({
      message: 'Está seguro que desea eliminar este ítem de su carrito?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Sí, quítelo',
          handler: () => { this.baseLocal.quitarDelCarro( item ); }
        }
      ]
    });
    await alert.present();
  }

}
