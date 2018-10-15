import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Usuario } from '../../models/usuario';
import { ZonasPage } from '../zonas/zonas';
import { LoaderProvider } from '../../providers/loader/loader';

@Component({
  selector: 'page-productores',
  templateUrl: 'productores.html',
})
export class ProductoresPage {



  public productores:Usuario[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _usuarioProvider:UsuarioProvider,
    public _loaderProvider:LoaderProvider) {
  }

  ionViewDidLoad() {
    this._loaderProvider.loaderON();
    this._usuarioProvider.getAll().subscribe(
      
      response => {       
        this.productores = response.data;
        console.log(this.productores);
        this._loaderProvider.loaderOFF();
      },
      error => {
        console.log(<any>error);	  
      }
    )
  }

  VerZonas(productor){
    localStorage.setItem("usuarioActivo", productor.nombre.toString());
    localStorage.setItem("idUsuarioActivo", productor.id.toString());
    //this.navCtrl.push(ZonasPage,{productor: productor});
    this.navCtrl.setRoot(ZonasPage,{productor: productor});
  }

}
