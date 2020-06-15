import { Component, ViewChild, ElementRef } from '@angular/core';
import { BaselocalService } from '../../services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';
import { NetworkService } from '../../services/network.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage {

  @ViewChild('flipcontainer', { static: false }) flipcontainer: ElementRef;

  access = {email: '', password: ''};
  regist = {email: '', celular: '', password: '', nombre: '', direccion: ''};
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

  togglePasswordMode() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
  }

  login() {
    //
    // console.log( this.access );
    this.buscando = true;
    this.network.buscarUsuario( this.access )
      .subscribe( (res: any) => {
        console.log('respuesta ', res);
        this.buscando = false;
        if ( res.resultado === 'ok' && res.data[0]?.id > 0 ) {
          if ( res.data[0].valido === true ) {
            this.baseLocal.guardaUltimoUsuario( res.data[0] );
            this.funciones.muestraySale( 'Hola ' + res.data[0].nombre + ', ' + this.funciones.textoSaludo() , 1.5 );
            this.router.navigate(['/tabs/tabmicuenta']);
          } else {
            this.funciones.msgAlert('', 'Email y clave reconocidos, pero aún no se ha validado con el correo que le fue enviado a la casilla electrónica que nos señaló. Siga las instrucciones del correo.');
          }
        } else {
          this.funciones.msgAlert('', 'Email y clave no reconocidos. Corrija y reintente.');
        }
      }, () => { this.buscando = false;
                 this.funciones.msgAlert( '', 'Sin conexion con el servidor. Reintente luego.' );
      });
    //
  }

}
