import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GestionUsuariosPage } from './gestion-usuarios';

@NgModule({
  declarations: [
    GestionUsuariosPage,
  ],
  imports: [
    IonicPageModule.forChild(GestionUsuariosPage),
  ],
})
export class GestionUsuariosPageModule {}
