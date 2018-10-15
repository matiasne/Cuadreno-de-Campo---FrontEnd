import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Zona } from '../../models/zona';
import { CoordenadaPoligonoProvider } from '../../providers/coordenada-poligono/coordenada-poligono';
import { ZonaProvider } from '../../providers/zona/zona';
import { HistorialProvider } from '../../providers/historial/historial';
import { GlobalesProvider } from '../../providers/globales/globales';
declare var google;

@Component({
  selector: 'page-edit-zona',
  templateUrl: 'edit-zona.html',
})
export class EditZonaPage {


  public idZonaSeleccionada:number;

  public dibujandoZona:boolean = false;
  public poligonoDibujo:any;
  public pathDibujado:any;

  public zonas:Zona[];
  public zona:Zona;
  public titulo:String;
  public tipoEdicion:String;
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _coordenadaPoligonoProvider:CoordenadaPoligonoProvider,
    public _zonaProvider:ZonaProvider,
    public viewCtrl: ViewController,
    public _historialProvider:HistorialProvider,
    public _globalesProvider:GlobalesProvider,
    private alertCtrl: AlertController
  ) {
    this.zona = new Zona();
  }

  ionViewDidLoad() {   
    this.tipoEdicion = this.navParams.get('tipoEdicion');    

    
    if(this.tipoEdicion == "edicion"){
      this.titulo = "Editar Zona";
      this.zona = this._globalesProvider.elementoSeleccionado;

      console.log("Recibiendo:")
      console.log(this.zona)
      
    }
    else{
      this.titulo = "Nueva Zona";
      this.zona.tipo = "Zona";
    }

    var input = document.getElementById('localidad-input');
    var searchBox = new google.maps.places.SearchBox(input);

  }


  CargarHistorialNuevaZona(){
    
    this._historialProvider.cargarNuevoElemento(
      0,
      0,
      this.zona.ID_LUGAR_ZONA,
      10,
      "Creación de Zona"
    );

  }

  CargarHistorialUpdateZona(){
    
    this._historialProvider.cargarNuevoElemento(
      0,
      0,
      this.zona.ID_LUGAR_ZONA,
      10,
      "Datos de Zona Actualizados"
    );

  }

  Cancelar(){
    this.dismiss(undefined);
  }

  Guardar(){          
    
    this.zona.DS_LUGAR_ZONA = (<HTMLInputElement>document.getElementById('localidad-input')).value;
    if(this.tipoEdicion == "nuevo"){      
      this.CargarHistorialNuevaZona(); 
    }
    else{    
      this.CargarHistorialUpdateZona();
    }

    console.log("Guardando....:")
    console.log(this.zona)
    this.dismiss(this.zona); 
  }


  dismiss(data) {
    console.log("Devolviendo..")
    console.log(data)
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
