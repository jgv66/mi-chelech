import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

// import { Plugins, Capacitor } from '@capacitor/core';
// const { Http } = Capacitor.Plugins;

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  url = environment.API_URL;

  constructor(private http: HttpClient ) {
    console.log('<<< NetworkService >>>');
  }

  vitrina( offset, landing?, ofertas?, banner? ) {
    const body = { offset, landing, ofertas, banner };
    return this.http.post<any[]>(this.url + '/g2s_buscar', body );
  }

  categorias() {
    const body = {};
    return this.http.post<any[]>(this.url + '/g2s_categorias', body );
  }

  buscarProductos( texto, offset ) {
    const body = { texto, offset };
    return this.http.post<any[]>(this.url + '/g2s_buscar', body );
  }

  buscarProdCategoria( texto, offset ) {
    const body = { texto, offset };
    return this.http.post<any[]>(this.url + '/g2s_buscarcategorias', body );
  }

  buscarUsuario( user ) {
    const pssw = window.btoa(user.password);
    const body = { email: user.email, pssw };
    return this.http.post<any[]>(this.url + '/g2s_usuario', body );
  }

  crearUsuario( user ) {
    const pssw = window.btoa(user.password);
    const body = { email: user.email, pssw, celu: user.celular, nombre: user.nombre, direccion: user.direccion };
    return this.http.post<any[]>(this.url + '/g2s_insUsuario', body );
  }

  olvideMiClave( forgot )  {
    const body = { email: forgot.email, celu: forgot.celular };
    return this.http.post<any[]>(this.url + '/g2s_forgot', body );
  }

}
