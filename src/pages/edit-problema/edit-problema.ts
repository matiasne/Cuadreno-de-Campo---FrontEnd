import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Problema } from '../../models/problema';
import { ProblemasProvider } from '../../providers/problemas/problemas';
import { TipoProblema } from '../../models/tipoProblema';


//@IonicPage()
@Component({
  selector: 'page-edit-problema',
  templateUrl: 'edit-problema.html',
})
export class EditProblemaPage {

  public titulo:String;
  public tiposProblemas:TipoProblema[];
  public problema:Problema;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _problemaProvider:ProblemasProvider
  ) {
    this.problema = new Problema(0,"","","","");
  }

  ionViewDidLoad() {

    this.problema = this.navParams.get('problema');

    if(this.problema.id == 0){
      this.titulo = "Nuevo Problema";
    }
    else{
      this.titulo = "Editar Problema";
    }

    this._problemaProvider.getTipos().subscribe(
      response=>{ 
        this.tiposProblemas = response.data;
      },
      error=>{ 
        console.log(error);
      }
    )
  }

  Guardar(){

    if(this.problema.id == 0){
      this._problemaProvider.put(this.problema).subscribe(
        response=>{ 
          console.log(response);
          alert("Guardado Correctamente");
        },
        error=>{ 
          console.log(error);
        }
      )
    }
    else{
      this._problemaProvider.update(this.problema).subscribe(
        response=>{ 
          console.log(response);
          alert("Actualizado Correctamente");
        },
        error=>{
          console.log(error);
        }
      )
    }


    
  }

}
