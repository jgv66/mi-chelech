import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { BaselocalService } from 'src/app/services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-tabmicuenta',
  templateUrl: './tabmicuenta.page.html',
  styleUrls: ['./tabmicuenta.page.scss'],
})
export class TabmicuentaPage implements OnInit {

  constructor( private router: Router,
               private alertCtrl: AlertController,
               public baseLocal: BaselocalService,
               private funciones: FuncionesService) { }

  ngOnInit() {}

  tengoUsuario() {
    return ( this.baseLocal.user?.id ) ? true : false;
  }

  login() {
    this.router.navigate(['/tabs/login']);
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      message: 'Está seguro que desea cerrar su sesión?',
      mode: 'ios',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {}
        }, {
          text: 'Sí. Cerrar sesión! ',
          handler: () => {
            this.baseLocal.user = undefined;
            this.funciones.muestraySale( 'Gracias por visitarnos. Que tenga un excelente día.', 2, 'middle' );
          }
        }
      ]
    });
    await alert.present();
  }

  forgot() {
    this.router.navigate(['/tabs/loginforgot']);
  }

  crearUsuario() {
    this.router.navigate(['/tabs/logincrear']);
  }


}
