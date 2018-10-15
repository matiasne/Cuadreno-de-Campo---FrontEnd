import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { EditProblemaPage } from '../edit-problema/edit-problema';
import { Problema } from '../../models/problema';
import { ProblemasProvider } from '../../providers/problemas/problemas';

/**
 * Generated class for the ListaProblemasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'page-lista-problemas',
  templateUrl: 'lista-problemas.html',
})
export class ListaProblemasPage {

  public problemas:Problema[];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _problemaProvider:ProblemasProvider
  ) {
  }

  ionViewDidLoad() {
    
    this._problemaProvider.getAll().subscribe(
      response=>{
        console.log(response); 
        this.problemas = response.data;
      },
      error=>{
        console.log(error);
      }
    )
  }

  Editar(problema){
    this.navCtrl.push(EditProblemaPage,{problema: problema});
  }

  NuevoProblema(){
    var problema = new Problema(0,"","","","");
    this.navCtrl.push(EditProblemaPage,{problema: problema});
  }

}
