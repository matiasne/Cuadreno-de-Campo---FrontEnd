import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { CosechaProvider } from '../../providers/cosecha/cosecha';
import { Cosecha } from '../../models/cosecha';
import { GlobalesProvider } from '../../providers/globales/globales';

/**
 * Generated class for the EditCampanasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-edit-cosechas',
  templateUrl: 'edit-cosechas.html',
})
export class EditCosechasPage {

  public cosechas:Cosecha[];
  public nuevaCosecha:Cosecha;
  public cosechaSeleccionada:Cosecha;
  public agregarNuevo:boolean = false;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _cosechaProvider:CosechaProvider,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    public _globalesProvider:GlobalesProvider,
    ) {

      this.nuevaCosecha = new Cosecha(0,"","","","","");
  }

  ionViewDidLoad() {
    this.ObtenerCosechas();
  }

  ObtenerCosechas(){
  //Aca debería realizar una subscripción a cosechas de globales 
  }

  ActualizarCosechas(){
    this._globalesProvider.Inicializar();
  }

  VerNuevoInput(){
    this.agregarNuevo = true;
  }

  NuevoItem(){
    this.agregarNuevo = false;
    this._cosechaProvider.put(this.nuevaCosecha).subscribe(
      response=>{
        if(response.code == '400'){
          this.presentToast("La Campaña: "+this.nuevaCosecha.CD_COSECHA+" ya existe");       
        }
        else{
          this.presentToast("Camapaña "+this.nuevaCosecha.CD_COSECHA+" agregada");
          this.ActualizarCosechas();
          this.ObtenerCosechas();
        }        
      },
      error=>{
        console.log(error);
      }
    )
  }

  Borrar(){
    this._cosechaProvider.delete(this.cosechaSeleccionada.ID_COSECHA).subscribe(
      response=>{
        alert(response.message);
        this.ObtenerCosechas();
      },
      error=>{
        console.log(error);
      }
    )
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

  Seleccionar(){
    
    if(this.cosechaSeleccionada!= undefined) {  
      this._globalesProvider.SetearCosechaSeleccionada(this.cosechaSeleccionada);        
      this.presentToast("Mostrando lotes de campaña: "+this.cosechaSeleccionada.CD_COSECHA);
      this.viewCtrl.dismiss();
    }
    else{
      this.presentToast("Elegir al menos una campaña");
    }
  }

  Cancelar(){
    this.viewCtrl.dismiss(undefined);
  }
  

}
