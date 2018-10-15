import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { LoteProvider } from '../../providers/lote/lote';
import { Lote } from '../../models/lote';
import { CosechaProvider } from '../../providers/cosecha/cosecha';
import { Cosecha } from '../../models/cosecha';
import { PlaguicidaProvider } from '../../providers/plaguicida/plaguicida';
import { CultivoProvider } from '../../providers/cultivo/cultivo';
import { Cultivo } from '../../models/cultivo';
import { Plaguicida } from '../../models/plaguicida';
import { Revision } from '../../models/revision';
import { RevisionProvider } from '../../providers/revision/revision';
import { HistorialProvider } from '../../providers/historial/historial';
import { GlobalesProvider } from '../../providers/globales/globales';
import { MapaProvider } from '../../providers/mapa/mapa';
import { LoaderProvider } from '../../providers/loader/loader';


//@IonicPage()
@Component({
  selector: 'page-edit-lote',
  templateUrl: 'edit-lote.html',
})
export class EditLotePage {

  public titulo:String;
  public lote:Lote; 
  public cosechas:Cosecha[];
  public path;
  public poly;

  public direccion:String;


  public edicionEstado:boolean = false;
  public cultivos:Cultivo[];
  public plaguicidas:Plaguicida[];

  public tipoEdicion:String;

  constructor(
    public navCtrl: NavController,   
    public navParams: NavParams,
    public _loteProvider:LoteProvider,
    public _cosechaProvider:CosechaProvider,
    public viewCtrl: ViewController,
    public _cultivoProvider:CultivoProvider,
    public _plaguicidaProvider:PlaguicidaProvider,
    public _historialProvider:HistorialProvider,
    public _globalesProvider:GlobalesProvider,
    public _mapaProvider:MapaProvider,
    private alertCtrl: AlertController,
    public _loaderProvider:LoaderProvider
) {
      this.lote = new Lote();
  }

  ionViewDidLoad() {   
    
    this.tipoEdicion = this.navParams.get('tipoEdicion');

    if(this.tipoEdicion == "edicion"){
      this.titulo = "Editar Lote";
      this.lote = this._globalesProvider.elementoSeleccionado;
    }
    else{
      this.titulo = "Nuevo Lote";
      //this.lote. = this._globalesProvider.CampanaSeleccionada.id;
      this.lote.tipo = "Lote";this.lote.tipo = "Lote";
      this.lote.CD_CAMPO = this._globalesProvider.elementoSeleccionado.id;
    }
    
    
    this._cosechaProvider.getAll().subscribe(
      response => {
        console.log(response.data);
        this.cosechas = response.data;
        //this.lote.idCampana = this._globalesProvider.CampanaSeleccionada.id;
      },
      error => {
        console.log(<any>error);	  
      }
    )

    this._loaderProvider.loaderON();
    this._cultivoProvider.getAll().subscribe(
      response =>{
        this.cultivos = response.data;
        console.log(response.message);
        this._loaderProvider.loaderOFF();
      },
      error => {
        console.log(<any>error)
      }
    );

    this._plaguicidaProvider.getAll().subscribe(
      response =>{
        console.log(response.data);
        this.plaguicidas = response.data;        
      },
      error => {
        console.log(<any>error);
      }
    );
    
    
    
  }


  CargarHistorialNuevoLote(){
    
    this._historialProvider.cargarNuevoElemento(
      this.lote.CD_CAMPO,
      this.lote.CD_LOTE,
      this.lote.CD_LOTE,
      5,
      "Lote Creado"
    );

  }

  CargarHistorialUpdateLote(){
    
    this._historialProvider.cargarNuevoElemento(
      this.lote.CD_CAMPO,
      this.lote.CD_LOTE,
      this.lote.CD_LOTE,
      6,
      "Datos del Lote Actualizados"
    );

  }

  CargarHistorialUpdateRevision(){
    
    this._historialProvider.cargarNuevoElemento(
      this.lote.CD_CAMPO,
      this.lote.CD_LOTE,
      this.lote.CD_LOTE,
      7,
      "Revision de Lote Actualizada"
    );

  }

  Guardar(){   

    if(this.tipoEdicion == "nuevo"){
      
      this.CargarHistorialNuevoLote(); 
    }
    else{      
      this.CargarHistorialUpdateLote();
      
    }
    
    this.dismiss(this.lote);    
  }



  obtenerFechaFormateada(date:Date){
    
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();

    return yyyy+"-"+mm+"-"+dd;
  }



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
