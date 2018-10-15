import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { RegistroVisita } from '../../models/registroVisita';

/**
 * Generated class for the RegistroVisitaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-registro-visita',
  templateUrl: 'registro-visita.html',
})
export class RegistroVisitaPage {

  public titulo:String;
  public registro:RegistroVisita;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,) {
    this.titulo = "Detalles de Registro";
    this.registro = new RegistroVisita(0,0,0,"","","","","");
  }

  ionViewDidLoad() {
    this.registro = this.navParams.get('registro');

  }

  Cerrar(){
    this.viewCtrl.dismiss();
  }

}
