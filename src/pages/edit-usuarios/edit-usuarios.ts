import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { Usuario } from '../../models/usuario';
import { Entidad } from '../../models/entidad';
import { GlobalesProvider } from '../../providers/globales/globales';
import { EditUserPage } from '../edit-user/edit-user';

/**
 * Generated class for the EditUsuariosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-usuarios',
  templateUrl: 'edit-usuarios.html',
})
export class EditUsuariosPage {

  public usauriosFiltrados:Usuario[];
  public palabra:String;

  public ingenieros:Entidad[];
  public contratistas:Entidad[]; 

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _usuarioProvider:UsuarioProvider,
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    public _globalesProvider:GlobalesProvider,    
    public modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    console.log('Solicitando Usuarios');
        
    
  }

  NuevoUsuario(){
    var usr = new Usuario();
    let EditUserPAge = this.modalCtrl.create(EditUserPage, {usuario: usr});
    EditUserPAge.present();
  }

  Buscar(){
    this.usauriosFiltrados = [];
    this._usuarioProvider.getByNombre(this.palabra).subscribe(
      response=>{
        if(response.code == "200"){
          this.usauriosFiltrados = response.data;
          console.log(this.usauriosFiltrados);
        }
        
      },
      error=>{
        console.log(error);
      }
    )
  }

  

  SeleccionarUsuario(usr){
    console.log(usr);
    let EditUserPAge = this.modalCtrl.create(EditUserPage, {usuario: usr});
    EditUserPAge.present();

    EditUserPAge.onDidDismiss(data => {
      this.Buscar();
    });
  }

  EliminarUsuario(usaurio){
    
  }

  Cancelar(){
    this.viewCtrl.dismiss();
  }

  

}
