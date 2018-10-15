import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, AlertController, ModalController } from 'ionic-angular';
import { Quimico } from '../../models/quimico';
import { Herramienta } from '../../models/herramienta';
import { Tarea } from '../../models/tarea';
import { QuimicoProvider } from '../../providers/quimico/quimico';
import { HerramientaProvider } from '../../providers/herramienta/herramienta';
import { TareaProvider } from '../../providers/tarea/tarea';
import { Lote } from '../../models/lote';
import { LoteProvider } from '../../providers/lote/lote';
import { HistorialProvider } from '../../providers/historial/historial';
import { CosechaProvider } from '../../providers/cosecha/cosecha';
import { Cosecha } from '../../models/cosecha';
import { GlobalesProvider } from '../../providers/globales/globales';
import { Select } from 'ionic-angular';
import { RevisionProvider } from '../../providers/revision/revision';
import { LoaderProvider } from '../../providers/loader/loader';
import { Grupo } from '../../models/grupos';
import { Subgrupo } from '../../models/subgrupo';
import { Producto } from '../../models/producto';
import { ConceptosProvider } from '../../providers/conceptos/conceptos';
import { Concepto } from '../../models/concepto';
import { Entidad } from '../../models/entidad';
import { Subscription } from 'rxjs/Subscription';
import { AgregarProductoPage } from '../agregar-producto/agregar-producto';
import { ProductoAgregado } from '../../models/productoAgregado';
import { ProductosAgregadoProvider } from '../../providers/producto-agregado/producto-agregado';

/**
 * Generated class for the EditTareaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-edit-tarea',
  templateUrl: 'edit-tarea.html',
})
export class EditTareaPage {

  @ViewChild('SeleccionLote') SeleccionLote: Select;
  
  public flagNuevaTarea: boolean;
  public id:number;
  public quimicos:Quimico[];
  public herramientas:Herramienta[];
  public tarea:Tarea; 

  public conceptos:Concepto[];
  public subgruposFiltrados:Subgrupo[];
  public conceptoSeleccionado:Concepto;

  public productos:Producto[];
  
  public contratistas:Entidad[];
  public subscriptionContratistas:Subscription;
  public contratistaSeleccionado:Entidad;
  //Hardcodeado
  public tipoTarea:String;

  public lotesSeleccion:Lote[];
  public lotesAfectados:any;
  public titulo:String;

  public idLoteSeleccionado:number;

  public estado:String;

  public agregarNuevoRegistro:boolean = false;

  public tipoEdicion:String;

  public dosis:number;
  public hectareas:number;

  public totalProducto:number;

  public productosAgregados:any;


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _quimicoProvider:QuimicoProvider,
    public _herramientaProvider:HerramientaProvider,
    public _tareaProvider:TareaProvider,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    public _loteProvider:LoteProvider,
    public _historialProvider:HistorialProvider,
    public _cosechaProvide:CosechaProvider,
    public _globalesProvider:GlobalesProvider,
    private alertCtrl: AlertController,
    public _revisionProvider:RevisionProvider,
    public _loaderProvider:LoaderProvider,
    public _conceptoProvider:ConceptosProvider,
    public modalCtrl: ModalController,
    public _productosAgregados:ProductosAgregadoProvider
  ) {
    this.tarea = new Tarea(0,this.obtenerFechaFormateada(new Date()),0,0,"","",0,"",0,0,"",0,0,"","",0,"");
    this.lotesAfectados = new Array();
    this.productosAgregados = new Array();
  }

  ionViewDidLoad() { 

    //Cosas que aparecen en los menús
    this.conceptos = this._globalesProvider.conceptos;
    this.productos = this._globalesProvider.productos;
    this.contratistas = this._globalesProvider.contratistas;
    this.lotesSeleccion = this._globalesProvider.ObtenerSoloLotes();

    //Parametros precargados    
    this.tipoEdicion = this.navParams.get('tipoEdicion');

    if(this.tipoEdicion == "nuevo"){ //Si no tiene id entonces debe crear una visita y obtenerlo de la respuesta
      
      this.titulo = "Nueva Tarea";

      console.log("Nueva tarea...");

      this.tarea.idVisita = this.navParams.get('idVisita');
      this.tarea.idEstablecimiento = this._globalesProvider.elementoSeleccionado.CD_CAMPO;
      
      console.log("parametro lotes afectados");
      console.log(this.navParams.get('lotesAfectados'));
      if(this.navParams.get('lotesAfectados') != undefined){      
        this.navParams.get('lotesAfectados').forEach((element)=> {          
          this.AsignarLoteAfectado(element.CD_LOTE,element.QT_HECTAREAS);
        }); 
      }
      else{
        
        if(this._globalesProvider.elementoSeleccionado.tipo == "Campo"){       
          this.AsignarLotesDelCampo();  
        }
        else{
          this.AsignarLoteAfectado(this._globalesProvider.elementoSeleccionado.CD_LOTE,this._globalesProvider.elementoSeleccionado.QT_HECTAREAS); 
        }
      }       

      this.tarea.fecha = this.obtenerFechaFormateada(new Date());    
      this.tarea.idUsuario =  localStorage.getItem('idUsuarioActivo');
      this.tarea.nombreUsuario =  localStorage.getItem('usuarioActivo'); 
    }
    else{
      this.titulo = "Editar Tarea";
      this.tarea = this.navParams.get('tarea');
      if(this.tarea != undefined)
        this.ObtenerLotesAfectados();
        this.ObtenerProductosAgregados();
    }

    this.conceptoSeleccionado = this._globalesProvider.GetConceptoByID(this.tarea.idConcepto);
    this.contratistaSeleccionado = this._globalesProvider.GetContratistaByID(this.tarea.idEntidad);
    this.MultiplicarDosis();
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

  VerAgregarLote(){ 
    this.SeleccionLote.open();
  }

  MultiplicarDosis(){ 
    let hectareasTotales = 0;
    this.lotesAfectados.forEach(element =>{
      hectareasTotales += Number(element.hectareasProductoAplicado);
    })

    this.productosAgregados.forEach(element =>{
      element.totalAgregar = Number(element.dosis) * hectareasTotales;
      console.log(element.totalAgregar);
    })    
  }

  AsignarLotesDelCampo(){
    console.log("Asignando lotes del campo"+this.tarea.idEstablecimiento);
      this.lotesSeleccion.forEach(lote =>{
        if(lote.CD_CAMPO == this.tarea.idEstablecimiento){
          console.log(lote);
          this.AsignarLoteAfectado(lote.CD_LOTE,lote.QT_HECTAREAS);
        }
      })   
  }

  ObtenerProductosAgregados(){
    this.productosAgregados = [];
    this._productosAgregados.getByTarea(this.tarea.id).subscribe(
      response =>{
        console.log(response);        
        if(response.code == "200"){
          if(response.data != undefined){
            response.data.forEach(element => {
              console.log(element);
              this.AgregarProducto(element);
                            
            }); 
            this.MultiplicarDosis();           
          }
        }
        
      },
      error=>{

      }
    )
  }


  ObtenerLotesAfectados(){
    this.lotesAfectados = [];
    this._loaderProvider.loaderON();
    this._tareaProvider.getLotesAfectados(this.tarea.id).subscribe(
      response=>{
        console.log(response.message);
        console.log(response.data);
        if(response.data != undefined){
          response.data.forEach(element => {
            console.log(element);            
            this.AsignarLoteAfectado(element.CD_LOTE,element.hectareasAplicado); 
                     
          });          
        }
        this._loaderProvider.loaderOFF();
        this.MultiplicarDosis();  
      },
      error=>{
        console.log(error);
        this._loaderProvider.loaderOFF();
      }
      
    )
  }  

  GuardarLotes(){   

    if(this.lotesAfectados != undefined ){

      this._tareaProvider.deleteLotesAfectadosFromVisita(this.tarea).subscribe(
        response=>{
          this.lotesAfectados.forEach(element=>{      
            this._tareaProvider.putLoteAfectado(this.tarea.id,element.CD_LOTE,element.hectareasProductoAplicado).subscribe(
              response=>{
                this.CargarHistorialTarea(element)
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

  GuardarProductosAgregados(){
    
    this._productosAgregados.deleteProductosAfectadosFromTarea(this.tarea).subscribe(
      response=>{
        this.productosAgregados.forEach(element=>{
          element.idTarea = this.tarea.id;
          this._productosAgregados.put(element).subscribe(
            response=>{
              console.log(response);
            },
            error=>{
              console.log(error);
            }
          )
        })  
      },
      error=>{

      }
    )            
    
      
  }

  CargarHistorialTarea(elemento){
    
    console.log(elemento);


    if(this.tipoEdicion == "nuevo"){
      
      if(elemento.tipo == "Campo"){
        this._historialProvider.cargarNuevoElemento(
          elemento.CD_CAMPO,
          0,
          this.tarea.id,
          8,
          "Nueva Tarea Asignada: "+elemento.DS_CAMPO
        );
      }
  
      if(elemento.tipo == "Lote"){
        this._historialProvider.cargarNuevoElemento(
          elemento.CD_CAMPO,
          elemento.CD_LOTE,
          this.tarea.id,
          8,
          "Nueva Tarea Asignada: "+elemento.DS_LOTE
        );
      }

    }
    else{
      
      if(elemento.tipo == "Campo"){
        this._historialProvider.cargarNuevoElemento(
          elemento.CD_CAMPO,
          0,
          this.tarea.id,
          8,
          "Tarea Modificada: "+elemento.DS_CAMPO
        );
      }
  
      if(elemento.tipo == "Lote"){
        this._historialProvider.cargarNuevoElemento(
          elemento.CD_CAMPO,
          elemento.CD_LOTE,
          this.tarea.id,
          8,
          "Tarea Modificada: "+elemento.DS_LOTE
        );
      }
    }
    
  }

  VerAgregarProducto(){

    let AgregarProducto = this.modalCtrl.create(AgregarProductoPage,{});
    AgregarProducto.onDidDismiss(data => {
      console.log("datos devueltos");
      console.log(data);
      if(data!= undefined)
        this.AgregarProducto(data);
    });
    AgregarProducto.present();  
  }

  AgregarProducto(productoAgregado:ProductoAgregado){
    this.productosAgregados.push(productoAgregado);
    this.MultiplicarDosis();
  }

  BorrarProducto(id){    
    this.productosAgregados.forEach((item,index) =>{
      if(item.id == id){        
        this.productosAgregados.splice(index,1); //Lo borramos de la lista de afectados
        this.MultiplicarDosis();
      }
    });
  }


  Guardar(){

    if(this.lotesAfectados.length > 0){
      
      if(this.conceptoSeleccionado != undefined){
        this.tarea.idConcepto = this.conceptoSeleccionado.ID_GRW_CONCEPTO;
        this.tarea.dsConcepto = this.conceptoSeleccionado.DS_GRW_CONCEPTO;
      }

      if(this.contratistaSeleccionado != undefined){
        this.tarea.idEntidad = this.contratistaSeleccionado.ID_ENTIDAD;
        this.tarea.dsEntidad = this.contratistaSeleccionado.DS_NOMBRE_COMERCIAL;
      }

      console.log(this.contratistaSeleccionado);
        
      if(this.tipoEdicion == "nuevo"){
        this._tareaProvider.put(this.tarea).subscribe(
          response =>{         
            console.log(response.message);
            this.tarea.id = response.data; //Actualizo el id
            this.GuardarLotes();
            this.GuardarProductosAgregados();
          },
          error =>{
            console.log(error);
          }
        )
      }
      else{
        this._tareaProvider.update(this.tarea).subscribe(
          response =>{       
            console.log(response.message);
            this.GuardarLotes();
            this.GuardarProductosAgregados();
          },
          error =>{
            
            console.log(error);
          }
        )
      }
      this.dismiss(this.tarea);
    }
    else{
      this.presentToast("Ingresar por lo menos un lote"); 
    }
  }


  AsignarLoteAfectado(idlote,hectareasAplicado){
    //Extraemos el lote de la lista de seleccion
    var elemento = this.lotesSeleccion.forEach((item,index) =>{
      if(item.CD_LOTE == idlote){        
        item.hectareasProductoAplicado = hectareasAplicado;     
        this.lotesSeleccion.splice(index,1);      
        this.lotesAfectados.push(item);      
      }
    });       
      
  }

  BorrarLoteAfectado(id){
    
    this.lotesAfectados.forEach((item,index) =>{
      if(item.CD_LOTE == id){
        this.lotesSeleccion.push(item); //Lo volvemos a la lista de seleccion
        this.lotesAfectados.splice(index,1); //Lo borramos de la lista de afectados
        this.MultiplicarDosis();
      }
    });
  }


  Cancelar(){
    this.dismiss(undefined);
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

  
  dismiss(data) {   
    this.viewCtrl.dismiss(data);
  }

}
