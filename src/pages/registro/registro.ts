import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Usuario } from '../../models/usuario';
import { ZonasPage } from '../zonas/zonas';
import { HomePage } from '../home/home';

/**
 * Generated class for the RegistroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {

  public email:String;
  public nombre:String;
  public password:String;
  public passwordConfirm:String;
  public usuarioLogueado:Usuario;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,  
    public _usuarioProvider:UsuarioProvider,
    private toastCtrl: ToastController
  ) {
    this.usuarioLogueado = new Usuario();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroPage');
  }

  registro(){
    this._usuarioProvider.registro(this.email,this.nombre,this.password,this.passwordConfirm).subscribe(
      response=>{
        if(response.code == "200"){
          this.usuarioLogueado = response.data;
          console.log(response.data);
        //  localStorage.setItem("usuarioActivo", this.usuarioLogueado.nombre);
          localStorage.setItem("idUsuarioActivo", this.usuarioLogueado.id.toString());
          localStorage.setItem("idEntidadLogueada", this.usuarioLogueado.ID_ENTIDAD.toString());
          
          this.navCtrl.setRoot(ZonasPage);
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

  cancelar(){
    this.navCtrl.setRoot(HomePage);
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
