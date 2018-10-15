import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { HistorialProvider } from '../../providers/historial/historial';
import { ItemHistorial } from '../../models/itemHistorial';
import { EditComentarioPage } from '../edit-comentario/edit-comentario';
import { Comentario } from '../../models/comentario';
import { GlobalesProvider } from '../../providers/globales/globales';
import { EditTareaPage } from '../edit-tarea/edit-tarea';
import { TareaProvider } from '../../providers/tarea/tarea';
import { VisitaProvider } from '../../providers/visita/visita';
import { EditVisitaPage } from '../edit-visita/edit-visita';
import { ComentarioProvider } from '../../providers/comentario/comentario';
import { LoaderProvider } from '../../providers/loader/loader';

/**
 * Generated class for the HistorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 //1 - Nuevo Comentario
 //2 - Update Comentario
 //3 - Nuevo Establecimiento
 //4 - Update Establecimiento
 //5 - Nuevo Lote
 //6 - Update Lote
 //7 - Update Revision
 //8 - Nueva Tarea
 //9 - Nueva Visita
 //10 - Nueva Zona
 //11 - Update Zona
 
@Component({
  selector: 'page-historial',
  templateUrl: 'historial.html',
})
export class HistorialPage {

  public itemsHistorial:ItemHistorial[];
  public filtro:String;
  public idEstablecimiento:number;
  public idLote:number;
  public fechaDesde:String;
  public fechaHasta:String;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _historialProvider:HistorialProvider,
    public modalCtrl: ModalController,
    public _globalesProvider:GlobalesProvider,
    public viewCtrl: ViewController,
    public _tareaProvider:TareaProvider,
    public _visitaProvider:VisitaProvider,
    public _comentarioProvider:ComentarioProvider,
    public _loaderProvider:LoaderProvider
  ) {
    this.filtro = "all";
    this.fechaDesde = "2010-02-02";
    this.fechaHasta = this.obtenerFechaFormateada(new Date());
  }

  ionViewDidLoad() {

    let params;
    this._loaderProvider.loaderON();  
    if(this._globalesProvider.elementoSeleccionado.tipo == "Campo"){    
      
      this._historialProvider.getByEstablecimiento(this._globalesProvider.elementoSeleccionado.CD_CAMPO).subscribe(
        response=>{
          this.itemsHistorial = response.data;
          console.log(response.message);
          console.log(response.data);
          this._loaderProvider.loaderOFF();
        },
        erorr=>{
  
        }
      )
    }

    if(this._globalesProvider.elementoSeleccionado.tipo == "Lote"){
      
      this._historialProvider.getByLote(this._globalesProvider.elementoSeleccionado.CD_LOTE).subscribe(
        response=>{
          this.itemsHistorial = response.data;
          console.log(response.message);
          console.log(response.data);
          this._loaderProvider.loaderOFF();
        },
        erorr=>{
          
        }
      )
    }   
  }

  private pad2(number) {   
    return (number < 10 ? '0' : '') + number  
  }
  obtenerFechaFormateada(date:Date){    
    var dd = this.pad2(date.getDate());
    var mm = this.pad2(date.getMonth()+1); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy+"-"+mm+"-"+dd;
  }

  presentComentarioModal(id){

    console.log("comentario id: "+id);

    this._comentarioProvider.get(id).subscribe(
      response =>{          
          console.log(response);
          var comentario = response.data;
          let AgregarComentario = this.modalCtrl.create(EditComentarioPage, { comentario: comentario });
          AgregarComentario.present();
      },
      error =>{
        console.log(<any>error);
      }
    )

    
  }

  presentTareaModal(id){

    this._tareaProvider.get(id).subscribe(
      response =>{
        console.log(response);
        let AgregarTarea = this.modalCtrl.create(EditTareaPage, { tipoEdicion :"edicion", tarea: response.data[0] });
        AgregarTarea.present();
      },
      error=>{
        console.log(error);
      }
    )    
  }

  presentVisitaModal(id){

    this._visitaProvider.get(id).subscribe(
      response =>{
        let AgregarTarea = this.modalCtrl.create(EditVisitaPage, { tipoEdicion :"edicion", visita: response.data[0] });
        AgregarTarea.present();
      },
      error=>{

      }
    )    
  }

  Cancelar(){
    this.viewCtrl.dismiss();
  }

}
