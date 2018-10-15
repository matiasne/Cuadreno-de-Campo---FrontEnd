import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, AlertController, ModalController } from 'ionic-angular';
import { Visita } from '../../models/visita';
import { VisitaProvider } from '../../providers/visita/visita';
import { RegistroVisita } from '../../models/registroVisita';
import { ProblemasProvider } from '../../providers/problemas/problemas';
import { Problema } from '../../models/problema';
import { TipoProblema } from '../../models/tipoProblema';
import { Lote } from '../../models/lote';
import { LoteProvider } from '../../providers/lote/lote';
import { HistorialProvider } from '../../providers/historial/historial';
import { CosechaProvider } from '../../providers/cosecha/cosecha';
import { Cosecha } from '../../models/cosecha';
import { GlobalesProvider } from '../../providers/globales/globales';
import { Select } from 'ionic-angular';
import { RegistroVisitaPage } from '../registro-visita/registro-visita';
import { RevisionProvider } from '../../providers/revision/revision';
import { LoaderProvider } from '../../providers/loader/loader';
import { EditTareaPage } from '../edit-tarea/edit-tarea';
import { Tarea } from '../../models/tarea';
import { TareaProvider } from '../../providers/tarea/tarea';

import { EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { FileQueueObject, FileUploaderService } from '../../providers/file-uploader/file-uploader.service';

//@IonicPage()
@Component({
  selector: 'page-edit-visita',
  templateUrl: 'edit-visita.html',
})
export class EditVisitaPage {

  @ViewChild('SeleccionLote') SeleccionLote: Select;

  public titulo:String;
  public visita:Visita;

  public tiposProblemas:TipoProblema[];
  
  public problemas:Problema[];

  public problemasFiltrados:Problema[];

  public nuevoRegistro:RegistroVisita;
  public registros:any; 

  public agregarNuevoRegistro:boolean = false;

  public lotesAfectados:Lote[];
  public lotesSeleccion:Lote[];
  public idLoteSeleccionado:number;
  
  public flagNuevaVisita:boolean = false;

  public cosechas:Cosecha[];

  public tareas:any;

  public tipoEdicion:String;

  @Output() onCompleteItem = new EventEmitter();
  @ViewChild('fileInput') fileInput;
  queue: Observable<FileQueueObject[]>;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _visitaProvider:VisitaProvider,
    public _problemaProvider:ProblemasProvider,
    public _cosechaProvide:CosechaProvider,
    public _loteProvider:LoteProvider,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    public _historialProvider:HistorialProvider,
    public _globalesProvider:GlobalesProvider,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public _revisionProvider:RevisionProvider,
    public _loaderProvider:LoaderProvider,
    public _tareaProvider:TareaProvider,
    public uploader: FileUploaderService
  ) {
    this.visita = new Visita(
      0,
      0,
      "",
      "",
      this.obtenerFechaFormateada(new Date())
    );

    //this.LoteSeleccionado = new Lote(0,0,"","",0,"","","","","");
    this.nuevoRegistro = new RegistroVisita(0,0,0,"","","","","");
    this.registros = new Array();
    this.lotesAfectados = new Array();
    this.tareas = new Array();
  }

  completeItem = (item: FileQueueObject, response: any) => {
    this.onCompleteItem.emit({ item, response });
  }

  addToQueue() {
    const fileBrowser = this.fileInput.nativeElement;
    this.uploader.addToQueue(fileBrowser.files);
  }

  ionViewDidLoad() {
    
    this.tipoEdicion = this.navParams.get('tipoEdicion');
    this.lotesSeleccion = this._globalesProvider.ObtenerSoloLotes();

    var idEstablecimiento;   
    
    this.queue = this.uploader.queue;
    this.uploader.onCompleteItem = this.completeItem;
   

    if(this.tipoEdicion == "nuevo"){ //Si no tiene id entonces debe crear una visita y obtenerlo de la respuesta
      console.log("Nueva visita...");
      this.titulo = "Nueva Visita"; 
      
      this.visita.nombreUsuario =  localStorage.getItem('usuarioActivo');
      this.visita.idUsuario =  localStorage.getItem('idUsuarioActivo');
      this.visita.fecha = this.obtenerFechaFormateada(new Date());      

      this.visita.idEstablecimiento = this._globalesProvider.elementoSeleccionado.CD_CAMPO;
      console.log(this.visita.idEstablecimiento);
      if(this._globalesProvider.elementoSeleccionado.tipo == "Campo"){       
        this.AsignarLotesDelCampo();       
      }
      else{
        this.AsignarLoteAfectado(this._globalesProvider.elementoSeleccionado.CD_LOTE); 
      }

    }
    else{
      this.titulo = "Editar Visita";
      this.visita = this.navParams.get('visita');
      this.ObtenerRegistrosVisita();
      this.ObtenerLotesAfectados();
      this.ObtenerTareasDisparadas();
    }     

    console.log(this.visita);

    this._problemaProvider.getTipos().subscribe(
      response=>{
        this.tiposProblemas = response.data;
      },
      error=>{
        console.log(error);
      }
    )

    this._problemaProvider.getAll().subscribe(
      response =>{
        this.problemas = response.data;
      },
      error => {
        console.log()
      }
    );
   
  }

  
  AsignarLotesDelCampo(){
    console.log("Asignando lotes del campo:"+this.visita.idEstablecimiento);
    this.lotesSeleccion.forEach(lote =>{
      if(lote.CD_CAMPO == this.visita.idEstablecimiento){
        console.log(lote);
        this.AsignarLoteAfectado(lote.CD_LOTE);
      }
    })   
  }

  AsignarProblema(problema){
    this.nuevoRegistro.idProblema = problema.id;
    this.nuevoRegistro.nombre = problema.nombre;
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

  FiltrarProblemasPorTipo(id){
    this.problemasFiltrados = this.problemas.filter(
      problema => problema.idTipo === id);
  }

  

  VerNuevoRegistro(){
    this.agregarNuevoRegistro = true;
  }

  VerAgregarLote(){
    this.SeleccionLote.open();
  }

  ObtenerRegistrosVisita(){
    this.registros = [];
    this._visitaProvider.getRegistros(this.visita.id).subscribe(
      response=>{
        if(response.data != undefined){
          response.data.forEach(registro =>{
            console.log(registro);
            this.registros.push(registro);
          });
        }
      },
      error=>{
        console.log(error);
      }
    )
  }

  VerDetallesRegistro(registro){
    let RegistrovisitaModal = this.modalCtrl.create(RegistroVisitaPage,{registro: registro});
    RegistrovisitaModal.present();
  }

  AsignarLoteAfectado(idlote){   
    
    var elemento = this.lotesSeleccion.forEach((item,index) =>{
      if(item.CD_LOTE == idlote){
        this.lotesSeleccion.splice(index,1);
        this.lotesAfectados.push(item);        
      }
    });    

    
  }

  ObtenerLotesAfectados(){
    this.lotesAfectados = [];   
    this._loaderProvider.loaderON(); 
    this._visitaProvider.getLotesAfectados(this.visita.id).subscribe(
      response=>{
        console.log(response.message);
        console.log(response.data);
        if(response.data != undefined){
          response.data.forEach(element => {
            console.log(element);
            this.AsignarLoteAfectado(element.CD_LOTE);             
          });          
        }
        this._loaderProvider.loaderOFF();
      },
      error=>{
        console.log(error);
        this._loaderProvider.loaderOFF();
      }
    )
  }

  ObtenerTareasDisparadas(){
    this._tareaProvider.getByVisita(this.visita.id).subscribe(
      response=>{
        if(response.data != undefined){
          response.data.forEach((item,index) =>{                 
            this.tareas.push(item);          
          });     
        }
        console.log(response);   
      },
      error=>{

      }
    )
  }

  
  CancelarGuardarRegistro(){
    this.agregarNuevoRegistro = false;
  }

  GuardarRegistro(){
    this.agregarNuevoRegistro = false;
    this.nuevoRegistro.idVisita = this.visita.id;
    let _registro = Object.assign({}, this.nuevoRegistro);
    this.registros.push(_registro);
    console.log(this.registros)
  }
  

  BorrarRegistro(registro){
    this.registros.forEach((item,index) =>{
      if(item.id == registro.id){        
        this.registros.splice(index,1); //Lo borramos de la lista de afectados
      }
    });
  }

  
  /*GuardarLoteAfectado(idlote){
    var lote = this.lotesSeleccion.find(item => item.CD_LOTE === idlote )
    this.AsignarLoteAfectado(lote);
    console.log(this.lotesAfectados);   
  } */

  BorrarLoteAfectado(id){   
    var elemento = this.lotesAfectados.forEach((item,index) =>{
      if(item.CD_LOTE == id){
        this.lotesSeleccion.push(item); //Lo volvemos a la lista de seleccion
        this.lotesAfectados.splice(index,1); //Lo borramos de la lista de afectados
      }
    });
  }

  

  CargarHistorialVisita(elemento){ 

    console.log(elemento);

    if(this.tipoEdicion == "nuevo"){

      if(elemento.tipo == "Campo"){
        this._historialProvider.cargarNuevoElemento(
          elemento.CD_CAMPO,
          0,
          this.visita.id,
          9,
          "Nueva Visita Asignada al Campo: "+elemento.DS_CAMPO
        );
      }
  
      if(elemento.tipo == "Lote"){
        this._historialProvider.cargarNuevoElemento(
          0,
          elemento.CD_LOTE,
          this.visita.id,
          9,
          "Nueva Visita Asignada al Lote: "+elemento.DS_LOTE
        );
      }

    }
    else{
      
      if(elemento.tipo == "Campo"){
        this._historialProvider.cargarNuevoElemento(
          elemento.CD_CAMPO,
          0,
          this.visita.id,
          9,
          "Visita Actualizada: "+elemento.DS_CAMPO
        );
      }
  
      if(elemento.tipo == "Lote"){
        this._historialProvider.cargarNuevoElemento(
          0,
          elemento.CD_LOTE,
          this.visita.id,
          9,
          "Visita Actualizada: "+elemento.DS_LOTE
        );
      }
    }
    
  }

  //Esto hay que optimizar!!!!!!!

  presentAgregarTarea(){ 

    if(this.registros.length > 0 && this.lotesAfectados.length > 0){
      if(this.tipoEdicion == "nuevo"){
        this._visitaProvider.put(this.visita).subscribe(
          response =>{            
            this.visita.id = response.data; //Actualizo el id
            this.MostrarDialogTarea();
          },
          error =>{
            alert("Error al guardar Visita");
          }
        )
      }
      else{
        this._visitaProvider.update(this.visita).subscribe(
          response =>{             
            this.MostrarDialogTarea();
          },
          error =>{
            alert("Error al guardar Visita");
          }
        )
      }
      
    }
    else{
      this.presentToast("Ingresar por lo menos un registro y por lo menos un lote"); 
    }    
  }

  MostrarDialogTarea(){
    let AgregarTarea = this.modalCtrl.create(EditTareaPage, { 
      tipoEdicion :"nuevo", 
      idVisita:this.visita.id, 
      lotesAfectados:this.lotesAfectados 
    });

    AgregarTarea.onDidDismiss(data => {
      console.log("tarea devuelta")
      console.log(data)
      if(data!= undefined)
        this.tareas.push(data);
    });

    AgregarTarea.present();  
  }

  BorrarTarea(tarea){
    this._tareaProvider.delete(tarea.id).subscribe(
      response=>{
        console.log(response);
        alert("Tarea Borrada");
      },
      error=>{
        console.log(error);
      }
    )
  }

  GuardarRegistrosYLotes(){


    if(this.registros != undefined){

      this._visitaProvider.deleteRegistrosFromVisita(this.visita).subscribe(
        response=>{
          this.registros.forEach(element => {
            element.idVisita = this.visita.id;
            this._visitaProvider.putRegistro(element).subscribe(
              response=>{
                console.log(response.message);
              },
              error=>{
                console.log(error);
              })
          });
        },
        error=>{

        }
      )

      
    }

    if(this.lotesAfectados != undefined ){

      this._visitaProvider.deleteLotesAfectadosFromVisita(this.visita).subscribe(
        response=>{
          this.lotesAfectados.forEach(element=>{      
            this._visitaProvider.putLoteAfectado(this.visita.id,element.CD_LOTE).subscribe(
              response=>{
                this.CargarHistorialVisita(element)
                console.log(response.message);
              },
              error=>{
              
              }
            ) 
          });
        },
        error=>{

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

  Guardar(){
    
    if(this.registros.length > 0 && this.lotesAfectados.length > 0){
      if(this.tipoEdicion == "nuevo"){
        this._visitaProvider.put(this.visita).subscribe(
          response =>{
            
            this.visita.id = response.data; //Actualizo el id
            this.GuardarRegistrosYLotes();
            
          },
          error =>{
            alert("Error al guardar Visita");
          }
        )
      }
      else{
        this._visitaProvider.update(this.visita).subscribe(
          response =>{
            alert("Visita Actualizada");         
            this.GuardarRegistrosYLotes();       
          },
          error =>{
            alert("Error al guardar Visita");
          }
        )
      }
      this.dismiss();
      
    }
    else{
      this.presentToast("Ingresar por lo menos un registro y por lo menos un lote"); 
    }
  }

  Cancelar(){
    this.dismiss();
  }

  presentTareaModal(tarea){
    
    let AgregarTarea = this.modalCtrl.create(EditTareaPage, { tipoEdicion :"edicion", tarea: tarea });
    AgregarTarea.present();
      
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
