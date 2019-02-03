import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { Campo } from '../../models/campo';
import { Lote } from '../../models/lote';
import { Zona } from '../../models/zona';
import { MapaProvider } from '../../providers/mapa/mapa';
import { GlobalesProvider } from '../../providers/globales/globales';
import { Subscription } from 'rxjs';

/**
 * Generated class for the BuscarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()

class ElementoTabla {    
  constructor( 
      public id: number,
      public nombreLote:String,
      public nombreEstablecimiento:String,
      public nombreZona:String,
      
  ) { 
  }   
}

@Component({
  selector: 'page-buscar',
  templateUrl: 'buscar.html',
})
export class BuscarPage {

  

  public elementos:any;  

  public zonasFiltradas:Zona[];
  public camposFiltrados:Campo[];
  public lotesFiltrados:Lote[];
  
  public palabra:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public _mapaProvider:MapaProvider,
    public _globalesProvider:GlobalesProvider,
    private toastCtrl: ToastController,) {
    this.palabra = "";
    this.elementos = new Array();
  }

  ionViewDidLoad() {
    this.elementos = this._globalesProvider.elementos;
    console.log("Elementos obtenidos:")
    console.log(this.elementos);
  }

  Cancelar(){
    this.viewCtrl.dismiss();
  }

  Buscar(){

    console.log("Buscando "+this.palabra);

    this.zonasFiltradas =[];
    this.camposFiltrados =[];
    this.lotesFiltrados =[];


    this.elementos.forEach(element => {

      
      

      if(element.tipo == "Zona"){
        if((<Zona>element).DS_LUGAR_ZONA!= null){
          if((<Zona>element).DS_LUGAR_ZONA.toLowerCase().indexOf(this.palabra.toLowerCase()) >= 0)
          {
            this.zonasFiltradas.push(element);            
          }        
        }
      }

      if(element.tipo == "Campo"){

        console.log("!Campo")
        if((<Campo>element).DS_CAMPO!= null){
          if((<Campo>element).DS_CAMPO.toLowerCase().indexOf(this.palabra.toLowerCase()) >= 0)
          {
            console.log("!encontrado")
            this.camposFiltrados.push(element);
          }
        }
      }
      if(element.tipo == "Lote"){
        console.log("!Lote")
        if((<Lote>element).DS_LOTE!= null){
          if((<Lote>element).DS_LOTE.toLowerCase().indexOf(this.palabra.toLowerCase()) >= 0)
          {
            this.lotesFiltrados.push(element);
          }
        }
        
      }
    });
    console.log(this.lotesFiltrados);
  }


  SeleccionarElemento(elemento){
    this._globalesProvider.SetearElementoSeleccionado(elemento);
    this.dismiss();
  }


  presentToast(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  

  dismiss() {  
    
    this.viewCtrl.dismiss();
  }


}
