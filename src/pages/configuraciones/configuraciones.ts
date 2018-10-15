import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ListaProblemasPage } from '../lista-problemas/lista-problemas';
import { EditCosechasPage } from '../edit-cosechas/edit-cosechas';
import { ZonasPage } from '../zonas/zonas';

/**
 * Generated class for the ConfiguracionesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-configuraciones',
  templateUrl: 'configuraciones.html',
})
export class ConfiguracionesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguracionesPage');
  }

  ConfigurarProblemas(){
    this.navCtrl.push(ListaProblemasPage);
  }

  ConfigurarCosechas(){
    this.navCtrl.push(EditCosechasPage);
  }

  Cerrar(){
    this.viewCtrl.dismiss(undefined);
  }  

}
