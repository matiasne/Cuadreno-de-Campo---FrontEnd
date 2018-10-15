import { Component, NgZone, ViewChild } from '@angular/core';
import {  NavController, NavParams, ModalController, ToastController, AlertController } from 'ionic-angular';
import { CampoProvider } from '../../providers/campo/campo';
import { Usuario } from '../../models/usuario';
import { Campo } from '../../models/campo';
import { Zona } from '../../models/zona';
import { ZonaProvider } from '../../providers/zona/zona';
import { EditZonaPage } from '../edit-zona/edit-zona';
import { MapaProvider } from '../../providers/mapa/mapa';
import { Subscription } from 'rxjs/Subscription';
import { Lote } from '../../models/lote';
import { LoteProvider } from '../../providers/lote/lote';
import { BuscarPage } from '../buscar/buscar';
import { EditVisitaPage } from '../edit-visita/edit-visita';
import { Visita } from '../../models/visita';
import { EditTareaPage } from '../edit-tarea/edit-tarea';
import { Tarea } from '../../models/tarea';
import { EditComentarioPage } from '../edit-comentario/edit-comentario';
import { Comentario } from '../../models/comentario';
import { EditCampoPage } from '../edit-campo/edit-campo';
import { EditLotePage } from '../edit-lote/edit-lote';
import { LoaderProvider } from '../../providers/loader/loader';
import { CosechaProvider } from '../../providers/cosecha/cosecha';
import { Cosecha } from '../../models/cosecha';
import { EditCosechasPage } from '../edit-cosechas/edit-cosechas';
import { HistorialPage } from '../historial/historial';
import { ClimaticoPage } from '../climatico/climatico';
import { GlobalesProvider } from '../../providers/globales/globales';
import { CoordenadaPoligonoProvider } from '../../providers/coordenada-poligono/coordenada-poligono';

import { Select } from 'ionic-angular';
import { Entidad } from '../../models/entidad';
import { RevisionProvider } from '../../providers/revision/revision';
import { Revision } from '../../models/revision';
import { trigger, style, animate, transition } from '@angular/animations';

//@IonicPage()
@Component({
  selector: 'page-zonas',
  templateUrl: 'zonas.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('400ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('300ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class ZonasPage {

  @ViewChild('Cosecha') CosechaSelector: Select;
  @ViewChild('Ingeniero') IngenieroSelector: Select;

  private cargandoNuevo:boolean = false;
  public productor:Usuario;
  public mostrarMenu:String;

  private subscriptionElementoSeleccionado:Subscription;
  private subscriptionCamapanas:Subscription;
  private subscriptionCosechas:Subscription;
  private subscriptionIngenieros:Subscription;
  private subscriptionZonas:Subscription;

  public subscriptionUsuairoObs: Subscription;
  private usuario:Usuario;

  public mapaListo:boolean = false;

  public isLoaderOn:boolean = false;
  public loader:any;

  public cosechas:Cosecha[];
  public cosechaSeleccionada:Cosecha;

  public ingenieros:Entidad[];
  public ingenieroSeleccionado:Cosecha;

  public ZonaMarcada:Zona;
  public CampoMarcado:Campo;
  public LoteMarcado:Lote;
  public nombreCosechaSeleccionada:String;
  public titulo:String;

  public revision:Revision;
  public nombreEntidad:String;
  public showPanelLote:boolean = false;
  public showPanelCampo:boolean = false;
  public revisionPanel:Revision;


  public zonas:any;

  showLevel1 = null;
  showLevel2 = null;
  elemento3Activo = null;

  public isIngeniero:boolean = false;
  public isAdmin:boolean = false;

  public campoPanel:Campo;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _zonaProvider:ZonaProvider,
    public _campoProvider:CampoProvider,
    public _loteProvider:LoteProvider,
    public _mapaProvider:MapaProvider,
    public modalCtrl: ModalController,
    public zone:NgZone,
    private toastCtrl: ToastController,
    public _loaderProvider:LoaderProvider,
    public _coordenadaPoligonoProvider:CoordenadaPoligonoProvider,
    public _globalesProvider:GlobalesProvider,
    public _cosechaProvider:CosechaProvider,
    private alertCtrl: AlertController,
    private _revisionProvider:RevisionProvider
  ) {
    this.productor = new Usuario();
   
    this.mostrarMenu = "default";
    this.nombreEntidad = "";
    this.ZonaMarcada = new Zona();
    this.CampoMarcado = new Campo();
    this.LoteMarcado= new Lote();
    this.revisionPanel = new Revision();;
    this.campoPanel = new Campo();
  }

  AbrirSelectorCosecha() {
    this.CosechaSelector.open();
  }

  AbrirSelectorIngeniero() {
    this.IngenieroSelector.open();
  }
 
  ionViewDidLoad() {
  
    this._loaderProvider.loaderON();         
    this._globalesProvider.Inicializar();   

    
    this.ingenieros = this._globalesProvider.ingenieros;


    this.subscriptionZonas= this._globalesProvider.ObsZonas().subscribe(
      data=>{  
        this.zonas = data;    
      }
    )

    this.subscriptionElementoSeleccionado = this._globalesProvider.ObsElementoSeleccionado().subscribe(
      data =>{
        this.AbrirMenuDesplegable(data);
      }
    )
    
    //Actualiza si se ha realizado algún cambio
    this.subscriptionCosechas = this._globalesProvider.ObsCosechas().subscribe(
      data=>{  
        this.cosechas = data;       
      }
    )
    //Actualiza si se ha realizado algún cambio
    this.subscriptionIngenieros= this._globalesProvider.ObsIngenieros().subscribe(
      data=>{  
        this.ingenieros = data;       
      }
    )   
    
    
    //this.presentConfirm();

    this.subscriptionUsuairoObs = this._globalesProvider.ObsUsuarioLogueado().subscribe(
      usuario=>{
        if(usuario != undefined){
            this.usuario = usuario;
            console.log(this.usuario);
            if(this.usuario.admin == "1"){
              this.isAdmin = true;
              console.log("Administrador!")
            }
            else{
              console.log("No es admin");
              this.isAdmin = false;
            }
            
            if(this.usuario.idPropiedad == "48"){
              this.isIngeniero = true;
              console.log("Ingeniero!");

              
            }
            else{
              console.log("No es ingeniero");
              this.isIngeniero = false;
            }
          }
        }
        
    )

    

  } 


  

  Seleccionar(cosecha){
    
    if(cosecha != undefined) {  
      this._globalesProvider.SetearCosechaSeleccionada(cosecha);  
      this._globalesProvider.ObtenerDesdeServidor();             
      this.presentToast("Mostrando lotes de cosecha: "+cosecha.CD_COSECHA);     
    }
    else{
      this.presentToast("Elegir al menos una cosecha");
    }
  } 

  SeleccionarIngeniero(entidad){
    if(entidad != undefined) {  
      this._globalesProvider.SetearIngenieroSeleccionado(entidad); 
      this._globalesProvider.ObtenerDesdeServidor();       
      this.presentToast("Mostrando lotes de entidad: "+entidad.ID_ENTIDAD);     
    }
    else{
      this.presentToast("Elegir al menos una entidad");
    }
  }

  AbrirMenuDesplegable(elemento){

    if(elemento == undefined)
      return;

    console.log(elemento);

    if(elemento.tipo == "Zona"){
      this.zonas.forEach( (zona,index) => {      
        if(zona.ID_LUGAR_ZONA == elemento.ID_LUGAR_ZONA)
          this.showLevel1 = 'idx'+index;
          this.elemento3Activo = null;
          this.OcultarPanelCampo();
          this.OcultarPanelLote();
      });
    }

    if(elemento.tipo == "Campo"){
      this.zonas.forEach((zona,indexA) => {        
        zona.campos.forEach((campo,indexB)=>{
          if(campo.CD_CAMPO == elemento.CD_CAMPO){
           
            this.showLevel1 = 'idx'+indexA;
            this.showLevel2 = 'idx'+indexA+'idx'+indexB;
            this.elemento3Activo = null;
            this.MostrarPanelCampo(campo);
            this.OcultarPanelLote();
          }
        })        
      });
    }

    if(elemento.tipo == "Lote"){
      this.zonas.forEach((zona,indexA) => {        
        zona.campos.forEach((campo,indexB)=>{
          campo.lotes.forEach((lote,indexC)=>{
            if(lote.CD_LOTE == elemento.CD_LOTE){

              this.showLevel1 = 'idx'+indexA;
              this.showLevel2 = 'idx'+indexA+'idx'+indexB;                
              this.mostrarLoteActivo(indexC);
              this.OcultarPanelCampo();
              this.MostralPanelLote(lote);
            }            
          })
        })        
      });
    }    
  }

  IrAZona(zona){
   
    this._globalesProvider.SetearElementoSeleccionado(zona);
  }

  IrACampo(campo){
    this._globalesProvider.SetearElementoSeleccionado(campo);
  }

  OcultarPanelLote(){
    this.showPanelLote = false;
  }

  OcultarPanelCampo(){

    this.showPanelCampo = false;
  }

  MostrarPanelCampo(campo){
    this.campoPanel = campo;
    this.showPanelCampo = true;
  }

  MostralPanelLote(lote){
    this.showPanelLote = true;
    if(lote.ultimaRevision != undefined)
      this.revisionPanel = lote.ultimaRevision;
    else
      this.revisionPanel = new Revision();
  }

  IrALote(lote){
    this._globalesProvider.SetearElementoSeleccionado(lote);
  }

  presentBuscarModal() {
    let BuscarModal = this.modalCtrl.create(BuscarPage);
    BuscarModal.present();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Para comenzar selecciona el Campo o Lote que deseas gestionar',
      message: 'Deseas buscar un Campo o Lote?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          handler: () => {
            
          }
        },
        {
          text: 'Buscar',
          handler: () => {
            this.presentBuscarModal();
          }
        }
      ]
    });
    alert.present();
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


  toggleLevel1(idx) {
    this.elemento3Activo = null;
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  };
  
  toggleLevel2(idx) {
    this.elemento3Activo = null;
    if (this.isLevel2Shown(idx)) {
    //  this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
     // this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  };

  mostrarLoteActivo(i3){
    this.elemento3Activo = i3;
  }  

  isLevel3Shown(idx) {
    return this.elemento3Activo === idx;
  };
  

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };
  
  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };


}


