import { Component } from '@angular/core';
import { BaselocalService } from '../../services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';
import { NetworkService } from '../../services/network.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginforgot',
  templateUrl: './loginforgot.page.html',
  styleUrls: ['./loginforgot.page.scss'],
})
export class LoginforgotPage {

  forgot = {email: '', celular: ''};

  backType = 1;
  buscando = false;
  passwordType = 'password';
  barraTabs;  // variable para ocultar barra de tabs

  constructor(private funciones: FuncionesService,
              private router: Router,
              public baseLocal: BaselocalService,
              private network: NetworkService) {}

  ionViewWillEnter() {
    this.barraTabs = this.funciones.hideTabs();
  }
  ionViewWillLeave() {
    this.funciones.showTabs( this.barraTabs );
  }
  salir() {
    this.funciones.showTabs( this.barraTabs );
    this.router.navigate(['/tabs/tabmicuenta']);
  }

  meolvide() {
    //
    // console.log( this.access );
    this.buscando = true;
    this.network.olvideMiClave( this.forgot )
      .subscribe( (res: any) => {
        this.buscando = false;
        try {
          if ( res.resultado === 'ok' ) {
            this.funciones.msgAlert( '', 'Si los datos son reconocidos por el sistema, llegará un correo o un SMS a su teléfono con la actual clave recuperada.' );
            this.salir();
          } else {
            this.funciones.msgAlert('', 'Email y Nro. de Celular no reconocidos. Corrija y reintente.');
          }
        } catch (error) {
          this.funciones.msgAlert( '', error );
        }
      });
    //
  }

}
