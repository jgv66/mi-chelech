import { Injectable, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Subject, Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { FuncionesService } from './funciones.service';

@Injectable({
  providedIn: 'root'
})
export class BaselocalService implements OnInit {

  listSizeSubject: Subject<number>;
  misCompras: Observable<number>;

  user: any;
  config: any;
  miCarrito = [];

  constructor( private alertCtrl: AlertController,
               private funciones: FuncionesService ) {
    console.log('<<< BaselocalService >>>');
    //
    this.listSizeSubject = new Subject();
    this.misCompras = this.listSizeSubject.asObservable();
    //
  }

  // tslint:disable-next-line: contextual-lifecycle
  ngOnInit() {}

  inicializa() {
    // this.obtenUltimoUsuario();
    this.obtenUltimoConfig();
    this.initMiCarrito();
    this.initUsuario();
    this.initMensajes();
  }

  initUsuario() {
    return {  id: 0,
              email: '',
              nombre: '',
              celular: '',
              direccion: '',
              creacion: Date,
              valido: false
            };
  }

  initConfig() {
    return { descripcionamplia:     false,
             codigotecnico:         false,
             soloconstock:          false,
             usarlistacli:          false,
             ordenar:               '',
             imagenes:              false,
             adq_gps:               false,
             adq_enviarcorreolocal: false,
             adq_nvv_transitoria:   true
            };
  }

  initMensajes() {
    return [{ from: '',
              emailfrom: '',
              to: '',
              emailto: '',
              descripcion: '',
              fecha: null,
              oculto: false,
              eliminado: false,
              leido: false,
              respondido: false,
              fecharesp: null
            }];
  }

  initMiCarrito() {
    return [{ codigo: '',
              descrip: '',
              cantidad: '',
              precio: 0,
              listapre: '',
              metodolista: '',
              imagen: undefined
            }];
  }

  async guardaUltimoUsuario( data ) {
    await Plugins.Storage.set({
      key: 'go2shop_ultimo_usuario',
      value: data
    });
    this.user = data;
  }
  async obtenUltimoUsuario() {
    const ret = await Plugins.Storage.get({ key: 'go2shop_ultimo_usuario' });
    // const user = JSON.parse(ret.value);
    this.user = ( ret.value == null || ret.value === undefined ) ? this.initUsuario() : ret.value;
    return this.user;
  }

  async guardaUltimoConfig( data ) {
    await Plugins.Storage.set({
      key: 'go2shop_ultimo_config',
      value: data
    });
    this.config = data;
  }
  async obtenUltimoConfig() {
    const ret = await Plugins.Storage.get({ key: 'go2shop_ultimo_config' });
    this.config = ( ret.value == null || ret.value === undefined ) ? this.initConfig() : ret.value;
    return this.config;
  }

  actualizarConfig( Config ) {
      this.guardaUltimoConfig( Config );
  }

  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> funciones del carrito
  get CartZise() {
    return this.misCompras;
  }
  refreshCarrito() {
    this.listSizeSubject.next( this.miCarrito.length ); // next method updates the stream value
  }

  async pideCantidad( producto ) {
    const cantidad = '1';
    const prompt = await this.alertCtrl.create({
      header:   'Stock Bodega : ' + producto.stock_ud1.toString(),
      subHeader: 'Ingrese la cantidad a solicitar de este producto.',
      message: 'No debe sobrepasar el stock actual ni lo pedido si ya existe en el carro. El sistema lo validará',
      inputs:  [ { name: 'cantidad', placeholder: cantidad } ],
      buttons: [
        { text: 'Cancelar', handler: ()   => {} },
        { text: 'Guardar',  handler: data => {  producto.apedir = parseInt( data.cantidad, 0 ) || 1 ;
                                                this.Add2Cart( producto ); } }
      ]
    });
    await prompt.present();
  }

  async modificaCantidad( producto ) {
    const cantidad = producto.cantidad;
    const prompt = await this.alertCtrl.create({
      header:   'Stock Bodega : ' + producto.stock_ud1.toString(),
      subHeader: 'Ingrese la cantidad a solicitar de este producto.',
      message: 'No debe sobrepasar el stock actual ni la suma de lo pedido. El sistema lo validará',
      inputs:  [ { name: 'cantidad', placeholder: cantidad } ],
      buttons:
      [
        { text: 'Salir',
          handler: () => {}
        },
        { text: 'Cambiar !',
          handler: data => { producto.apedir = parseInt(data.cantidad, 0 ) || 1 ;
                             if ( producto.apedir > producto.stock_ud1 ) {
                               this.funciones.msgAlert('', 'Stock insuficiente para esta operación. Intente con otra cantidad.');
                             } else {
                               this.modificaCarrito( producto );
                               const largo = this.miCarrito.length;
                               for ( let i = 0 ; i < largo ; i++ ) {
                                   if ( this.miCarrito[i].codigo.trim() === producto.codigo.trim() &&
                                       this.miCarrito[i].bodega.trim() === producto.bodega.trim() ) {
                                       this.miCarrito[i].cantidad = producto.apedir;
                                   }
                               }
                             }
                            }
        }
      ]
    });
    await prompt.present();
  }

  Add2Cart( producto ) {
    if ( this.aunVacioElCarrito() ) {
        this.miCarrito[0].codigo       = producto.codigo;
        this.miCarrito[0].descrip      = producto.descripcion;
        this.miCarrito[0].cantidad     = producto.apedir;
        this.miCarrito[0].precio       = producto.precio;
        this.miCarrito[0].listapre     = producto.listaprecio;
        this.miCarrito[0].metodolista  = producto.metodolista;
        this.miCarrito[0].imagen       = producto.imagen;
    } else if ( this.existeEnCarrito( producto ) ) {
        this.agregaACarrito( producto );
    } else {
        this.miCarrito.push({ codigo:       producto.codigo,
                              descrip:      producto.descripcion,
                              cantidad:     producto.apedir,
                              precio:       producto.precio,
                              listapre:     producto.listaprecio,
                              metodolista:  producto.metodolista,
                              imagen:       producto.imagen });
    }
    //
    this.funciones.muestraySale( 'Item agregado a la bolsa', 1, 'middle', 'tertiary' );
    this.refreshCarrito(); // next method updates the stream value
  }

  existeEnCarrito( producto ) {
    const posicion = this.miCarrito.findIndex( item => item.codigo === producto.codigo );
    return ( posicion !== -1 ? true : false );
  }

  agregaACarrito( producto ) {
    const posicion = this.miCarrito.findIndex( item => item.codigo === producto.codigo );
    this.miCarrito[posicion].cantidad += producto.apedir;
  }

  modificaCarrito( producto ) {
    if ( producto.apedir <= 0 ) {
      this.funciones.muestraySale( 'Solo están permitidos valores positivos mayores a cero.', 1.5, 'middle' );
    } else {
      const posicion = this.miCarrito.findIndex( item => item.codigo === producto.codigo );
      this.miCarrito[posicion].cantidad -= this.miCarrito[posicion].cantidad;
      this.miCarrito[posicion].cantidad += producto.apedir;
    }
  }

  aunVacioElCarrito() {
    return ( this.miCarrito.length === 1 && this.miCarrito[0].codigo === '' );
  }

  sumaCarrito() {
    let tot = 0;
    this.miCarrito.forEach( element => {
      tot += element.cantidad * element.precio;
    });
    return tot;
  }

  quitarDelCarro( producto ) {
    //
    if ( !this.aunVacioElCarrito() ) {
        for (let i = 0; i < this.miCarrito.length; i++) {
          if ( this.miCarrito[i].codigo === producto.codigo ) {
            this.miCarrito.splice(i, 1);
          }
        }
    }
    //
    if ( this.miCarrito.length === 0 ) {
      this.initMiCarrito();
    }
    this.refreshCarrito(); // next method updates the stream value
    //
  }

}
