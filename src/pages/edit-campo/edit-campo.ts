import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Campo } from '../../models/campo';
import { CampoProvider } from '../../providers/campo/campo';
import { MapaProvider } from '../../providers/mapa/mapa';
import { HistorialProvider } from '../../providers/historial/historial';
import { GlobalesProvider } from '../../providers/globales/globales';
declare var google;
//@IonicPage()
@Component({
  selector: 'page-edit-campo',
  templateUrl: 'edit-campo.html',
})
export class EditCampoPage {

  public direccion:String;

  public tipoEdicion:String;
  public campo:Campo;
  public titulo:String;
  public dibujandoZona:boolean = false;
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _campoProvider:CampoProvider,
    public _mapaProvider:MapaProvider,
    public viewCtrl: ViewController,
    public _historialProvider:HistorialProvider,
    public _globalesProvider:GlobalesProvider,
    private alertCtrl: AlertController
  ) {
      this.campo = new Campo();
  }

  ionViewDidLoad() {    
    
    this.tipoEdicion = this.navParams.get('tipoEdicion');    

    if(this.tipoEdicion == "edicion"){
      this.titulo = "Editar Campo";
      this.campo = this._globalesProvider.elementoSeleccionado;
    }
    else{
      this.titulo = "Nuevo Campo";
      this.campo.CD_CAMPO = this._globalesProvider.elementoSeleccionado.CD_CAMPO;
    }

    var input = document.getElementById('localidad-input');
   // var searchBox = new google.maps.places.SearchBox(input);


  }

  CargarHistorialNuevoCampo(){
    
    this._historialProvider.cargarNuevoElemento(
      this.campo.CD_CAMPO,
      0,
      this.campo.CD_CAMPO,
      3,
      "Establecimiento Creado"
    );

  }

  CargarHistorialUpdateCampo(){
    
    this._historialProvider.cargarNuevoElemento(
      this.campo.CD_CAMPO,
      0,
      this.campo.CD_CAMPO,
      4,
      "Datos del Campo Actualizados"
    );

  }
/*
  Guardar(){   

    this.campo.ubicacion = (<HTMLInputElement>document.getElementById('localidad-input')).value;
    
    if(this.tipoEdicion == "nuevo"){
      
      this.CargarHistorialNuevoEstablecimiento(); 
    }
    else{      
      this.CargarHistorialUpdateEstablecimiento();
    }
    this.dismiss(this.establecimiento); 
    
  }
*/
  

  Cancelar(){
    this.dismiss(undefined);
  }


  dismiss(data) {    
    this.viewCtrl.dismiss(data);
  }

  preguntarSalirSinGuardar(){

    let alert = this.alertCtrl.create({
      title: 'Salir sin Guardar',
      message: 'Está seguro que quiere salir sin guardar?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {        
            this.Cancelar();
          }
        }
      ]
    });
    alert.present();     
  }

}
