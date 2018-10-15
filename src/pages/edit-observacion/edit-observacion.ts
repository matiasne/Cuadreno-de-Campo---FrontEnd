import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Observacion } from '../../models/observacion';
import { ObservacionProvider } from '../../providers/observacion/observacion';

//@IonicPage()
@Component({
  selector: 'page-edit-observacion',
  templateUrl: 'edit-observacion.html',
})
export class EditObservacionPage {

  public titulo:String;
  public id:number;
  public observacion:Observacion;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _observacionProvider:ObservacionProvider) {
      this.observacion = new Observacion(0,"","","","","","");
  }

  ionViewDidLoad() {
    this.observacion = this.navParams.get('observacion');

    if(this.observacion.id == 0){
      this.titulo = "Nueva Observacion";
    }
    else{
      this.titulo = "Editar Observacion";
    }

  }

  obtenerFechaFormateada(date:Date){
    
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();

    return yyyy+"-"+mm+"-"+dd;
  }

  Guardar(){
    if(this.observacion.id == 0){

      this.observacion.fecha = this.obtenerFechaFormateada(new Date());     
      this.observacion.idUsuario =  localStorage.getItem('idUsuarioActivo');
      this.observacion.nombreUsuario = localStorage.getItem('usuarioActivo');
      this.observacion.idEstablecimiento = localStorage.getItem('idEstablecimientoSeleccionado');
      this.observacion.idLote = localStorage.getItem('idLoteSeleccionado');
      this._observacionProvider.put(this.observacion).subscribe(
        response =>{
          alert("Observación Guardada");
          
        },
        error =>{
          alert("Error al guardar Observación");
          console.log(<any>error);
        }
      )

    }
    else{
      this._observacionProvider.update(this.observacion).subscribe(
        response =>{
          alert("Observación Guardada");
        },
        error =>{
          alert("Error al guardar Observación");
          console.log(<any>error);
        }
      )
    }
  }

}
