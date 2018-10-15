import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Usuario } from '../../models/usuario';
import { GlobalesProvider } from '../../providers/globales/globales';
import { Entidad } from '../../models/entidad';
import { UsuarioProvider } from '../../providers/usuario/usuario';

/**
 * Generated class for the EditUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {

  public usuario:Usuario;
  public ingenieros:Entidad[];
  public contratistas:Entidad[];
  public cambiarContrasena:String;
  public titulo:String;

  public entidadSeleccionada:Entidad;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public _globalesProvider:GlobalesProvider,
    public _usuarioProvider:UsuarioProvider
  ) {
    this.usuario = new Usuario();
  }

  ionViewDidLoad() {
    this.cambiarContrasena = "";
    console.log(this.navParams.get('usuario'));
    this.usuario = this.navParams.get('usuario');

    if(this.usuario.id == undefined){ //Usuario Nuevo!!
      this.titulo = "Nuevo Usuario";
    } 
    else{
      this.titulo = "Editar Usuario";
    }
    
    this.ingenieros = this._globalesProvider.ingenieros;   
  }

  Cancelar(){
    this.viewCtrl.dismiss();
  }

  GuardarUsuario(){
    console.log(this.usuario.id)
    if(this.usuario.id == undefined){
      console.log("guardando")
      this._usuarioProvider.put(this.usuario).subscribe(
        response=>{
          if(response.code == "200"){
            this.usuario.id = response.data;
            this.CambiarContrasena();
          }
          else{
            alert(response.message);
          }
          console.log(response);
          
        },
        error =>{
          console.log(error);
        }
      );
    }
    else{
      this._usuarioProvider.update(this.usuario).subscribe(
        response=>{
          console.log(response);
          this.CambiarContrasena();
        },
        error =>{
          console.log(error);
        }
      );
    }
    
  }

  CambiarContrasena(){
    console.log(this.cambiarContrasena+"!!!!!!!!!!");
    if(this.cambiarContrasena != ""){
      this._usuarioProvider.cambiarContrasena(this.cambiarContrasena,this.usuario).subscribe(
        response=>{
          console.log(response);
          alert("Contraseña cambiada")
        }
      )
    }
  }

  Guardar(){
    if(this.usuario.cuit != undefined){

    
      this._usuarioProvider.obtenerEntidadSQL(this.usuario.cuit,this.usuario).subscribe(
        response=>{
          this.usuario.ID_ENTIDADSQL = response.data;
          this._usuarioProvider.obtenerEntidadyRazonSocial(this.usuario.cuit,this.usuario).subscribe(
            response=>{
              console.log(response);
              this.usuario.ID_ENTIDAD = response.idEntidad;
              this.usuario.razon_social = response.razonSocial;
              this.GuardarUsuario();
            },
            error=>{
              console.log(error);
            }
          );   
        },
        error=>{
          console.log(error);
        }
      );
      this.viewCtrl.dismiss();
    }
    else{
      alert("Por favor ingrese un cuit");
    }

     

    

    
  }

  Borrar(){
    this._usuarioProvider.delete(this.usuario).subscribe(
      response =>{
        console.log(response);
        alert("Usuario eliminado");
        this.viewCtrl.dismiss();
      },
      error=>{
        console.log(error);
      }

    )
  }

}
