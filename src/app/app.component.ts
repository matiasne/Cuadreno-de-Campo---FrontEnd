import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, ModalController, ToastController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { trigger, style, animate, transition } from '@angular/animations';
import { ProductoresPage } from '../pages/productores/productores';
import { ConfiguracionesPage } from '../pages/configuraciones/configuraciones';
import { GlobalesProvider } from '../providers/globales/globales';
import { Subscription } from 'rxjs';
import { EditCosechasPage } from '../pages/edit-cosechas/edit-cosechas';
import { BuscarPage } from '../pages/buscar/buscar';
import { EditZonaPage } from '../pages/edit-zona/edit-zona';
import { MapaProvider } from '../providers/mapa/mapa';
import { EditCampoPage } from '../pages/edit-campo/edit-campo';
import { EditLotePage } from '../pages/edit-lote/edit-lote';
import { ZonaProvider } from '../providers/zona/zona';
import { CampoProvider } from '../providers/campo/campo';
import { LoteProvider } from '../providers/lote/lote';
import { ClimaticoPage } from '../pages/climatico/climatico';
import { EditVisitaPage } from '../pages/edit-visita/edit-visita';
import { EditTareaPage } from '../pages/edit-tarea/edit-tarea';
import { EditComentarioPage } from '../pages/edit-comentario/edit-comentario';
import { HistorialPage } from '../pages/historial/historial';
import { EstadisticasPage } from '../pages/estadisticas/estadisticas';
import { HomePage } from '../pages/home/home';
import { EditUsuariosPage } from '../pages/edit-usuarios/edit-usuarios';
import { EditRevisionPage } from '../pages/edit-revision/edit-revision';
import { RevisionProvider } from '../providers/revision/revision';
import { Usuario } from '../models/usuario';


@Component({
  templateUrl: 'app.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('200ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('100ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
})
export class MyApp {
  
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;


  public objLoaderStatus: boolean = true;

 // public guardarSoloDibujo:boolean = false;

  public subscriptionElementoaObs: Subscription;
  public subscriptionUsuairoObs: Subscription;
  private usuario:Usuario;
  
  public showSubmenuEdicionZona:boolean = false;
  public showSubmenuVerDatosZona:boolean = false;
  public showSubmenuAgregarDatoZona:boolean = false;
  public showSubmenuEdicionEstablecimiento:boolean = false;
  public showSubmenuVerDatosEstablecimiento:boolean = false;
  public showSubmenuAgregarDatoEstablecimiento:boolean = false;
  public showSubmenuEdicionLote:boolean = false;
  public showSubmenuVerDatosLote:boolean = false;
  public showSubmenuAgregarDatoLote:boolean = false;

  public isIngeniero:boolean = false;
  public isAdmin:boolean=false;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public _gloabalesProvider:GlobalesProvider,
    public menuCtrl: MenuController,
    public modalCtrl: ModalController,
    public _mapaProvider:MapaProvider,
    public _zonaProvider:ZonaProvider,
    public _campoProvider:CampoProvider,
    public _loteProvider:LoteProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private _revisionProvider:RevisionProvider
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
     /* { title: 'Home', component: ProductoresPage },*/
      { title: 'Home', component: HomePage }
    ]; 

    this.usuario = new Usuario();

    //Esto tengo que hacerlo con un subscribe

  }

  ActivarMenu(menu){

    this.menuCtrl.enable(false, 'menuZona');
    this.menuCtrl.enable(false, 'menuEstablecimiento');
    this.menuCtrl.enable(false, 'menuLote');
    this.menuCtrl.enable(false, 'menuDibujando');
    this.menuCtrl.enable(false, 'menuDefinirPunto');
    this.menuCtrl.enable(false, 'menuDibujoGuardado');
    this.menuCtrl.enable(false, 'default'); 
    this.menuCtrl.enable(true, menu);    
    

  }

  MostrarPlanSustentabilidad(){
    var win = window.open('./assets/doc/manual.pdf', '_blank');
    win.focus();
  }

  MostrarMenuEdicionZona(){
    if(this.showSubmenuEdicionZona)
      this.showSubmenuEdicionZona = false;
    else
      this.showSubmenuEdicionZona = true;
  }

  MostrarMenuAgregarDatoZona(){
    if(this.showSubmenuAgregarDatoZona)
      this.showSubmenuAgregarDatoZona = false;
    else
      this.showSubmenuAgregarDatoZona = true;
  }

  MostrarMenuVerDatosZona(){
    if(this.showSubmenuVerDatosZona)
      this.showSubmenuVerDatosZona = false;
    else
      this.showSubmenuVerDatosZona = true;
  }

  MostrarMenuEdicionEstablecimiento(){
    if(this.showSubmenuEdicionEstablecimiento)
      this.showSubmenuEdicionEstablecimiento = false;
    else
      this.showSubmenuEdicionEstablecimiento = true;
  }

  MostrarMenuAgregarDatoEstablecimiento(){
    if(this.showSubmenuAgregarDatoEstablecimiento)
      this.showSubmenuAgregarDatoEstablecimiento = false;
    else
      this.showSubmenuAgregarDatoEstablecimiento = true;
  }

  MostrarMenuVerDatosEstablecimiento(){
    if(this.showSubmenuVerDatosEstablecimiento)
      this.showSubmenuVerDatosEstablecimiento = false;
    else
      this.showSubmenuVerDatosEstablecimiento = true;
  }

  MostrarMenuEdicionLote(){
    if(this.showSubmenuEdicionLote)
      this.showSubmenuEdicionLote = false;
    else
      this.showSubmenuEdicionLote = true;
  }

  MostrarMenuAgregarDatoLote(){
    if(this.showSubmenuAgregarDatoLote)
      this.showSubmenuAgregarDatoLote = false;
    else
      this.showSubmenuAgregarDatoLote = true;
  }

  MostrarMenuVerDatosLote(){
    if(this.showSubmenuVerDatosLote)
      this.showSubmenuVerDatosLote = false;
    else
      this.showSubmenuVerDatosLote = true;
  }

  BuscarElemento(){
    console.log("Buscando!!!!!!!!!!!!!!!!!!!")
  }

  initializeApp() { 
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      
     


      this.subscriptionUsuairoObs = this._gloabalesProvider.ObsUsuarioLogueado().subscribe(
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
                console.log("Ingeniero!")
              }
              else{
                console.log("No es ingeniero");
                this.isIngeniero = false;
              }
            }
          }
          
      )

      this.subscriptionElementoaObs = this._gloabalesProvider.ObsElementoSeleccionado().subscribe(
        elemento => { 
          
            if(elemento != undefined){
            if(elemento.tipo == "Zona"){
              this.ActivarMenu('menuZona');
              
            }

            if(elemento.tipo=="Campo"){
              this.ActivarMenu('menuEstablecimiento');
             
            }

            if(elemento.tipo =="Lote"){
              this.ActivarMenu('menuLote');
              
            }
          }
          else{
            this.ActivarMenu('default');
            
          }  
            
          
        }
      )
    });
  }

  openPage(page) {    
    this.nav.setRoot(page.component);
  }

  presentConfiguraciones(){
    let EditCampana = this.modalCtrl.create(ConfiguracionesPage);    
    EditCampana.present();
  }




  EntrarModoDibujarUpdate(){

    //this.guardarSoloDibujo = true;
    this.ActivarMenu('menuDibujando');
    this._gloabalesProvider.RedibujarElementoSeleccionado();

  }


  EntrarDefinirPunto(){
    //this.guardarSoloDibujo = true;
    this.ActivarMenu('menuDefinirPunto');   
    this._mapaProvider.RemoverUltimoMarcador(); 
    this._gloabalesProvider.RedibujarPuntoElemntoSeleccionado();
  }

  preguntarSalirSinGuardar(){

    let alert = this.alertCtrl.create({
      title: 'Salir sin guardar',
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
            this._gloabalesProvider.CancelarEdicion();       
            this.ActivarMenuAnterior();
          }
        }
      ]
    });
    alert.present(); 

    
  }

  preguntarSalirSinGuardarPunto(){
    let alert = this.alertCtrl.create({
      title: 'Salir sin guardar',
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
            this.ActivarMenuAnterior();
            this._gloabalesProvider.CancelarEdicionPunto();
          }
        }
      ]
    });
    alert.present(); 
  }

  ActivarMenuAnterior(){
    
    console.log("!!!!!!!!");
    
    if(this._gloabalesProvider.elementoSeleccionado != undefined){

      if(this._gloabalesProvider.elementoSeleccionado.tipo == "Zona"){       
        this.ActivarMenu('menuZona');
      }
      else if(this._gloabalesProvider.elementoSeleccionado.tipo == "Campo"){
        this.ActivarMenu('menuEstablecimiento');
      }
      else if(this._gloabalesProvider.elementoSeleccionado == "Lote"){
        this.ActivarMenu('menuLote');
      }

      else{
        this.ActivarMenu('default');
        
      }
    }
    else{
      this.ActivarMenu('default');
    }
  }

  GuardarDibujo(){   
    
    this._gloabalesProvider.GuardarPoligonoEnServidor();

    if(this._gloabalesProvider.elementoSeleccionado != undefined){
      if(this._gloabalesProvider.elementoSeleccionado.tipo == "Zona"){
        this.ActivarMenu('menuZona');
      }
      if(this._gloabalesProvider.elementoSeleccionado.tipo == "Campo"){
        this.ActivarMenu('menuEstablecimiento');
      }
      if(this._gloabalesProvider.elementoSeleccionado == "Lote"){
        this.ActivarMenu('menuLote');
      }     
    }
    else{
        this.ActivarMenu('default');
    }
    //this.presentToast("El dibujo del sector ha sido guardado");
   }

   GuardarPunto(){
     
     this._gloabalesProvider.GuardarPuntoEnServidor();

     if(this._gloabalesProvider.elementoSeleccionado != undefined){
      if(this._gloabalesProvider.elementoSeleccionado.tipo == "Zona"){
        this.ActivarMenu('menuZona');
      }
      if(this._gloabalesProvider.elementoSeleccionado.tipo == "Campo"){
        this.ActivarMenu('menuEstablecimiento');
      }
      if(this._gloabalesProvider.elementoSeleccionado == "Lote"){
        this.ActivarMenu('menuLote');
      }     
    }
    else{
        this.ActivarMenu('default');
    }
   }


  Borrar(){

    let alert = this.alertCtrl.create({
      title: 'Borrar',
      message: 'Está seguro que quiere borrar el dibujo del elemento seleccionado?',
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
            this.presentToast("Eliminada");
            
            this._gloabalesProvider.BorrarDibujoSeleccionado();
            this.ActivarMenuAnterior();
          }
        }
      ]
    });
    alert.present();       
  }


  DeshacerCambio(){
    this._mapaProvider.DeshacerUltimpoPunto();
  }

  logout(){
    //this.navCtrl.setRoot(HomePage);
    this.nav.setRoot(HomePage);
    localStorage.setItem("token", "0");
    localStorage.setItem("idEntidadLogueada", "0");
    localStorage.setItem("idEntidadLogueadaSQL", "0");
    localStorage.setItem("idEntidad", "0");
    localStorage.setItem("idEntidadSQL", "0");
    localStorage.setItem("idPropiedad", "0");
    localStorage.setItem("idUsuarioActivo", "0");

  }

  administrarUsuarios(){
    if(this.isAdmin){
      let EditUsuarios = this.modalCtrl.create(EditUsuariosPage);
      EditUsuarios.present();
    }
    else{
      alert("Privilegios insuficientes");
    }
    
  }


  presentClimaticoModal() {
    let ClimaticoModal = this.modalCtrl.create(ClimaticoPage);
    ClimaticoModal.present();
  }

  presentEditRevision(){
   
        let EditRevision= this.modalCtrl.create(EditRevisionPage,{revision:this._gloabalesProvider.elementoSeleccionado.ultimaRevision});
        EditRevision.present();
      
    
  }


  presentAgregarVisita(){  
    console.log(this.isIngeniero);
    if(this.isIngeniero == true){ 
      let AgregarVisita = this.modalCtrl.create(EditVisitaPage, {tipoEdicion: "nuevo"});
      AgregarVisita.present();
    }
    else{
      alert("Privilegios insuficientes");
    }
  }

  presentAgregarTarea(){
    
    let AgregarTarea = this.modalCtrl.create(EditTareaPage, {tipoEdicion :"nuevo"});
    AgregarTarea.present();
  }

  presentAgregarComentario(){
    let AgregarComentario = this.modalCtrl.create(EditComentarioPage, { tipoEdicion: "nuevo" });    
    AgregarComentario.present();
  }

  presentVerHistorial(){
    let VerHistorial = this.modalCtrl.create(HistorialPage);
    VerHistorial.present();
  }

  presentEstadisticas(){
    let VerEstadisticas = this.modalCtrl.create(EstadisticasPage);
    VerEstadisticas.present();
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

  presentConfirm() {
    
  }


}
