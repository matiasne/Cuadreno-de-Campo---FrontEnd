import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Producto } from '../../models/producto';
import { GlobalesProvider } from '../../providers/globales/globales';
import { ProductoAgregado } from '../../models/productoAgregado';

/**
 * Generated class for the AgregarProductoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-agregar-producto',
  templateUrl: 'agregar-producto.html',
})
export class AgregarProductoPage {

  public productos:Producto[];
  public productoSeleccionado:Producto;

  public productoAgregado:ProductoAgregado;

  public dosis:number;
  public unidad:string;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _globalesProvider:GlobalesProvider,
    public viewCtrl: ViewController) {

      this.productoAgregado = new ProductoAgregado(0,"",0,0,"");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AgregarProductoPage');
    this.productos = this._globalesProvider.productos;
  }

  Cancelar(){    
    this.viewCtrl.dismiss();
  }

  Guardar(){

    this.productoAgregado.CD_GRW_PRODUCTO = this.productoSeleccionado.CD_GRW_PRODUCTO;
    this.productoAgregado.DS_GRW_PRODUCTO = this.productoSeleccionado.DS_GRW_PRODUCTO;
    this.productoAgregado.dosis = this.dosis;
    this.productoAgregado.unidad = this.unidad;
    this.viewCtrl.dismiss(this.productoAgregado);
  }

}
