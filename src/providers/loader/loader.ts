
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the LoaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoaderProvider {

  public isLoaderOn:boolean = false;
  public loader:any;

  constructor(  
    public loadingCtrl: LoadingController) {
  }

  loaderON(){
    console.log("Mostrando loader");
    if(this.isLoaderOn == false){
      this.isLoaderOn = true;
      this.loader = this.loadingCtrl.create({
        spinner: 'hide',
        content: `
        <div class="sk-cube-grid">
          <div class="sk-cube sk-cube1"></div>
          <div class="sk-cube sk-cube2"></div>
          <div class="sk-cube sk-cube3"></div>
          <div class="sk-cube sk-cube4"></div>
          <div class="sk-cube sk-cube5"></div>
          <div class="sk-cube sk-cube6"></div>
          <div class="sk-cube sk-cube7"></div>
          <div class="sk-cube sk-cube8"></div>
          <div class="sk-cube sk-cube9"></div>
        </div>`,     
      });
      this.loader.present();
    }
  }

  loaderOFF(){
    if(this.isLoaderOn == true){
      this.isLoaderOn = false;
      this.loader.dismiss();
    }
  }

}
