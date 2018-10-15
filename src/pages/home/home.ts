import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { LoteProvider } from '../../providers/lote/lote';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Usuario } from '../../models/usuario';
import { ZonasPage } from '../zonas/zonas';
import { RegistroPage } from '../registro/registro';
import { EntidadesProvider } from '../../providers/entidad/entidad';
import { GlobalesProvider } from '../../providers/globales/globales';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public email:String;
  public password:String;

  public datosUsuario:Usuario;

  constructor(
    public navCtrl: NavController,
    public _loteProvider:LoteProvider,
    public _usuarioProvider:UsuarioProvider,
    private toastCtrl: ToastController,
    private _entidadesProvider:EntidadesProvider,
    private _globalesProvider:GlobalesProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.ValidarToken();
  }

  ValidarToken(){
    this._usuarioProvider.validarToken().subscribe(
      response=>{
        if(response.code=="200"){
          console.log(response);
          localStorage.setItem("usuarioActivo", response.data.nombre);
          localStorage.setItem("idUsuarioActivo", response.data.id.toString());
          this.datosUsuario = response.data;
          this._globalesProvider.SetearUsuarioLogueado(this.datosUsuario);

          

          if(response.data.idEntidad != undefined){
            localStorage.setItem("idEntidadLogueada", response.data.idEntidad.toString());
            localStorage.setItem("idEntidadLogueadaSQL", response.data.idEntidadSQL.toString());
            this._entidadesProvider.getPropiedades(response.data.idEntidadSQL).subscribe(
              response=>{
                console.log(response)
                
                this._globalesProvider.SetearUsuarioLogueado(this.datosUsuario);
                
                localStorage.setItem("idPropiedad", "0"); //Aparcero por defecto
                
                if(response.code == "404"){
                  
                }
                else{

                  var esIngeniero = false;
                  response.data.forEach(element => { //Pueden tener muchas propiedades!
                    if(element.ID_PROPIEDAD == "48"){
                      localStorage.setItem("idPropiedad", "48");
                      this.datosUsuario.idPropiedad = "48"; //Tiene propiedades especiales
                      this._globalesProvider.SetearUsuarioLogueado(this.datosUsuario);
                    }                      
                  });            
                  
                }
                
              },
              error=>{
                console.log(error);
              }
            )
          }
         
            
          this.navCtrl.setRoot(ZonasPage);
        }
        else{
          console.log(response);
        }
      },
      error=>{

      }
    )
  }

  login(){
    this._usuarioProvider.login(this.email,this.password).subscribe(
      response =>{
        if(response.code == "200"){
          console.log(response.data);
          
          localStorage.setItem("token", response.data.token);
          this.ValidarToken();
          
        }
        else{
          console.log(response);
          this.presentToast(response.message);
        }
      },
      error=>{
        console.log(error);
      }
    )
  }

  createAccount(){
    this.navCtrl.setRoot(RegistroPage);
  }

  presentToast(mensaje) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 10000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }


}
