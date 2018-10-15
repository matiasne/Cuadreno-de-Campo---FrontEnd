import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Campo } from '../../models/campo';
import { LoteProvider } from '../../providers/lote/lote';
import { VisitaProvider } from '../../providers/visita/visita';
import { TareaProvider } from '../../providers/tarea/tarea';
import { ObservacionProvider } from '../../providers/observacion/observacion';
import { ComentarioProvider } from '../../providers/comentario/comentario';
import { Lote } from '../../models/lote';
import { Visita } from '../../models/visita';
import { Tarea } from '../../models/tarea';
import { Revision } from '../../models/revision';
import { Observacion } from '../../models/observacion';
import { Comentario } from '../../models/comentario';
import { EditVisitaPage } from '../edit-visita/edit-visita';
import { Cosecha } from '../../models/cosecha';
import { CosechaProvider } from '../../providers/cosecha/cosecha';
import { EditCosechasPage } from '../edit-cosechas/edit-cosechas';
import { EditObservacionPage } from '../edit-observacion/edit-observacion';
import { EditComentarioPage } from '../edit-comentario/edit-comentario';
import { EditLotePage } from '../edit-lote/edit-lote';
import { CoordenadaPoligonoProvider } from '../../providers/coordenada-poligono/coordenada-poligono';
import { EditCampoPage } from '../edit-campo/edit-campo';


/**
 * Generated class for the EstablecimientoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var google;

//@IonicPage()
@Component({
  selector: 'page-campo',
  templateUrl: 'campo.html',
})
export class CampoPage {

  map: any;

  public campo:Campo;
  public lotes:Lote[];
  public visitas:Visita[];
  public tareas:Tarea[];
  public revision:Revision;
  public observaciones:Observacion[];
  public comentarios:Comentario[];
  public cosechas:Cosecha[];
  public titulo:String;

  public registroPoligonos:any[];
  
  public superficie:number;

  public cosechaSeleccionada:number;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _loteProvider:LoteProvider,
    public _visitaProvider:VisitaProvider,
    public _tareaProvider:TareaProvider,
    public _observacionProvider:ObservacionProvider,
    public _comentarioProvider:ComentarioProvider,
    public _cosechaProvider:CosechaProvider,
    public _coordenadasPoliginoProvider:CoordenadaPoligonoProvider,
    
  ) {
    this.campo = new Campo();
    this.registroPoligonos = new Array();    
    this.cosechaSeleccionada = 0;

    console.log("COSNTRUCTOR");
  }

  RealizarSumaSuperficie(lotes:Lote[]){

    if(lotes!= undefined){
      lotes.forEach((element)=> {

        
        this.superficie += element.QT_HECTAREAS; 

        console.log("sumatoria"+ this.superficie);

      }); 
    }

  }

  ionViewDidEnter() {

    /*
       
    this.campo = this.navParams.get('campo');

    //this.GestionMapa();
    
    this._campanaProvider.getAll().subscribe(
      response => {
        console.log(response.data);
        this.campanas = response.data;
      },
      error => {
        console.log(<any>error);	  
      }
    ) 
    
    
    this._loteProvider.getLastCampana(this.campo.CD_CAMPO).subscribe(
      response => {
        console.log(response.data);
        this.lotes = response.data;
        
        if(this.lotes != undefined){
          this.lotes.forEach(lote =>{
            this.DibujarLoteMapa(lote);
          })
        }
        this.RealizarSumaSuperficie(response.data);      
      },
      error => {
        console.log(<any>error);	  
      }
    ) 

    this._visitaProvider.get3ByEstablecimiento(this.campo.CD_CAMPO).subscribe(
      response => {
        this.visitas = response.data;
      },
      error => {
        console.log(<any>error);	  
      }
    )

    this._observacionProvider.get3ByCampo(this.campo.CD_CAMPO).subscribe(
      response => {
        this.observaciones = response.data;
      },
      error => {
        console.log(<any>error);	  
      }
    )

    this._comentarioProvider.get3ByCampo(this.campo.CD_CAMPO).subscribe(
      response => {
        this.comentarios = response.data;
      },
      error => {
        console.log(<any>error);	  
      }
    ) */
  }


  EditarCampo(){ 
    this.navCtrl.push(EditCampoPage,{campo: this.campo}); 
  }

  NuevoLote(){
    var lote = new Lote();
    this.navCtrl.push(EditLotePage, {lote: lote, campo: this.campo});
  }


  NuevaVisita(){
    var visita = new Visita(0,0,"","","");
    this.navCtrl.push(EditVisitaPage, { visita: visita}); 
  }


  NuevaObservacion(){
    var observacion = new Observacion(0,"","","","","","");
    this.navCtrl.push(EditObservacionPage, { observacion: observacion}); 
  }

  NuevoComentario(){
    var comentario = new Comentario(0,"",0,0,"","","");
    this.navCtrl.push(EditComentarioPage,{ comentario: comentario} );
  }


  IrEditCosechas(){
    this.navCtrl.push(EditCosechasPage);
  }

  DibujarLoteMapa(lote){
    

    this._coordenadasPoliginoProvider.getCoordenadasPoligonoLote(lote.id).subscribe(
      response=>{

          if(response.code == '200'){
            console.log(response.data);

            var coordPoligono = new Array();              

            response.data.forEach((element)=> {
              console.log(element);
              coordPoligono.push({lat: parseFloat(element.latitud),lng:  parseFloat(element.longitud)});  
            });             
          
            console.log(coordPoligono);

            var poligono = new google.maps.Polygon({
              paths: coordPoligono,
              strokeColor: '#00FF00',
              strokeOpacity: 0.8,
              strokeWeight: 1,
              fillColor: '#00FF00',
              fillOpacity: 0.35,
              
            });

            poligono.setMap(this.map);

            this.registroPoligonos.push(poligono);

            google.maps.event.addListener(poligono, 'click', event => {
              
            });
        }
        else{
          console.log(response.message);
        }

      },
      error=>{

      }
    );
        
    

  }


  BorrarDibujosLotesMapa(){
    console.log(this.registroPoligonos);
    this.registroPoligonos.forEach(poligono =>{
      console.log("!!!!!!");
      poligono.setMap(null);
    })
  }
  

  


}
