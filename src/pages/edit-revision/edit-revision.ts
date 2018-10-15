import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Cultivo } from '../../models/cultivo';
import { Plaguicida } from '../../models/plaguicida';
import { Revision } from '../../models/revision';
import { RevisionProvider } from '../../providers/revision/revision';
import { CultivoProvider } from '../../providers/cultivo/cultivo';
import { PlaguicidaProvider } from '../../providers/plaguicida/plaguicida';
import { GlobalesProvider } from '../../providers/globales/globales';
import { VariedadProvider } from '../../providers/variedad/variedad';
import { Variedad } from '../../models/variedad';

@Component({
  selector: 'page-edit-revision',
  templateUrl: 'edit-revision.html',
})
export class EditRevisionPage {

  public id:number;
  public variedades:Variedad[];
  public plaguicidas:Plaguicida[];
  public revision:Revision;
  public titulo:String;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _revisionProvider: RevisionProvider,
    public _cultivoProvider:CultivoProvider,
    public _plaguicidaProvider:PlaguicidaProvider,
    public viewCtrl: ViewController,
    public _globalProvider:GlobalesProvider,    
    private alertCtrl: AlertController,
    private _variedadesProvider:VariedadProvider
  ) {

    this.revision = new Revision();
    
  }

  ionViewDidLoad() {
    

    if(this.navParams.get('revision') != undefined){
      console.log("!!!!Tomando parametro")
      console.log(this.navParams.get('revision'));
      this.revision = this.navParams.get('revision');
    }
    else{
      this.revision.plaguicidaClorado = "no";
    }
    
    console.log(this.revision.id)
      

    this._variedadesProvider.getAll().subscribe(
      response =>{
        console.log(response);
        this.variedades = response.data;
      },
      error => {
        console.log(error);
      }
    );

    

  }

  Cancelar(){
    this.viewCtrl.dismiss();
  }


  Guardar(){  

    if(this.revision.id == undefined){   //Si está guardando uno nuevo..... 

      this.revision.nombreUsuario =  localStorage.getItem('usuarioActivo');
      this.revision.idUsuario =  localStorage.getItem('idUsuarioActivo');
      this.revision.idEstablecimiento = this._globalProvider.elementoSeleccionado.CD_CAMPO;
      this.revision.idLote = this._globalProvider.elementoSeleccionado.CD_LOTE;

      this._revisionProvider.put(this.revision).subscribe(
        response =>{
          console.log(response);
          this._globalProvider.elementoSeleccionado.ultimaRevision = this.revision;
        },
        error =>{
          alert("Error al guardar Visita");
          console.log(<any>error);
        }
      )
    }
    else{
      this._revisionProvider.update(this.revision).subscribe(
        response =>{
          console.log(response);
        },
        error =>{
          alert("Error al guardar Visita");
          console.log(<any>error);
        }
      )
    }
    this.viewCtrl.dismiss();
  }

  preguntarSalirSinGuardar(){

    let alert = this.alertCtrl.create({
      title: 'Salir sin Guardar',
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
            this.Cancelar();
          }
        }
      ]
    });
    alert.present();     
  }

}
