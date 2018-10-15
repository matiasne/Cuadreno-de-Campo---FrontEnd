import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { ComentarioProvider } from '../../providers/comentario/comentario';
import { Comentario } from '../../models/comentario';
import { ItemHistorial } from '../../models/itemHistorial';
import { HistorialProvider } from '../../providers/historial/historial';
import { GlobalesProvider } from '../../providers/globales/globales';
import { LoaderProvider } from '../../providers/loader/loader';



//@IonicPage()
@Component({
  selector: 'page-edit-comentario',
  templateUrl: 'edit-comentario.html',
})
export class EditComentarioPage {

  public comentario:Comentario;
  public titulo:String;

  public comentarios:Comentario[];
  public nuevoHistorial:ItemHistorial;

  public tipoEdicion:String;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _comentarioProvider:ComentarioProvider,
    public viewCtrl: ViewController,
    public _historialProvider:HistorialProvider,
    public _globalesProvider:GlobalesProvider,
    private alertCtrl: AlertController,
    public _loaderProvider:LoaderProvider
  ) {

      this.comentario = new Comentario(0,"",0,0,"","","");
      
  }

  ionViewDidLoad() {
    
    this.tipoEdicion = this.navParams.get('tipoEdicion');    

    var idEstablecimiento;
    if(this._globalesProvider.elementoSeleccionado.tipo == "Campo")
      this.comentario.idEstablecimiento = this._globalesProvider.elementoSeleccionado.id;
    else
      this.comentario.idEstablecimiento = 0;


    var idLote;
    if(this._globalesProvider.elementoSeleccionado.tipo == "Lote"){
      this.comentario.idLote = this._globalesProvider.elementoSeleccionado.id;
      this.comentario.idEstablecimiento = this._globalesProvider.elementoSeleccionado.idEstablecimiento;
    }
    else
      this.comentario.idLote = 0;

    
    
    if(this.tipoEdicion == "nuevo"){
      this.titulo = "Nuevo Comentario";
      this.comentario.idUsuario = localStorage.getItem('idUsuarioActivo');
      this.comentario.nombreUsuario = localStorage.getItem('usuarioActivo');
    }
    else{
      this.titulo = "Editar Comentario";
      this.comentario = this.navParams.get('comentario');
      console.log(this.comentario);
       
    }

    this.ObtenerComentarios();

  }

  obtenerFechaFormateada(date:Date){
    
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();

    return yyyy+"-"+mm+"-"+dd;
  }

  CargarHistorialNuevoComentario(){   
    console.log("Historial cargado para:");
    console.log(this.comentario);
    this._historialProvider.cargarNuevoElemento(
      this.comentario.idEstablecimiento,
      this.comentario.idLote,
      this.comentario.id,
      1,
      "Nuevo Comentario: "+this.comentario.comentario
    );

  }

  CargarHistorialUpdateComentario(){    
    this._historialProvider.cargarNuevoElemento(
      this.comentario.idEstablecimiento,
      this.comentario.idLote,
      this.comentario.id,
      2,
      "Comentario Actualizado: "+this.comentario.comentario
    );
  }

  Guardar(){

    if(this.comentario.id == 0){

      this.comentario.fecha = this.obtenerFechaFormateada(new Date());
      this.comentario.nombreUsuario = localStorage.getItem('usuarioActivo');

      this._comentarioProvider.put(this.comentario).subscribe(
        response =>{
          this.comentario.id = response.data;
          this.ObtenerComentarios();
          this.CargarHistorialNuevoComentario();
          
        },
        error =>{
          alert("Error al guardar Observación");
          console.log(<any>error);
        }
      ) 
    }    
    else{
      this._comentarioProvider.update(this.comentario).subscribe(
        response =>{
          alert("Observación Guardada");
          this.ObtenerComentarios();
          this.CargarHistorialUpdateComentario();
        },
        error =>{
          alert("Error al guardar Observación");
          console.log(<any>error);
        }
      )
    }
    this.dismiss();
  }

  ObtenerComentarios(){
    if(this.comentario.idEstablecimiento != null){
      this._comentarioProvider.getByEstablecimiento(this.comentario.idEstablecimiento).subscribe(
        response => {
          this.comentarios = response.data;
        }, 
        error => {
          console.log(<any>error);	  
        }
      )      
    }

    if(this.comentario.idLote != null){
      this._comentarioProvider.getByLote(this.comentario.idLote).subscribe(
        response => {
          this.comentarios = response.data;
        },
        error => {
          console.log(<any>error);	  
        }
      )      
    }
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



  Cancelar(){
    this.dismiss();
  }

  dismiss() {
    //let data = { lote : this.lote };
    this.viewCtrl.dismiss();
  }

}
