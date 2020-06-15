import { Component, ViewChild, ElementRef } from '@angular/core';
import { BaselocalService } from '../../services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';
import { NetworkService } from '../../services/network.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logincrear',
  templateUrl: './logincrear.page.html',
  styleUrls: ['./logincrear.page.scss'],
})
export class LogincrearPage {

  regist = {email: '', celular: '', password: '', nombre: '', direccion: ''};

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

  togglePasswordMode() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  }

  register() {
    if ( this.regist.email === '' || this.regist.celular === '' || this.regist.password === '' ) {
      this.funciones.msgAlert('', 'Debe completar los datos obligatorios. Estos datos son necesarios para confeccionar un registro básico.');
      return;
    }
    //
    this.buscando = true;
    this.network.crearUsuario( this.regist )
      .subscribe( (res: any) => {
        this.buscando = false;
        try {
          // console.log('respuesta ', res);
          if ( res.resultado === 'ok' ) {
            this.funciones.msgAlert('', 'Gracias por registrarse en nuestra App. Un correo se le enviará para validar el registro.' );
            this.router.navigate(['/tabs/tabmicuenta']);
          } else {
            this.funciones.msgAlert('', res.data[0].mensaje );
          }
        } catch (error) {
          this.funciones.msgAlert( '', 'Sin conexion con el servidor. Reintente luego.' );
        }
      }, (error) => {
        this.funciones.msgAlert( '', error );
      } );
//
  }

}