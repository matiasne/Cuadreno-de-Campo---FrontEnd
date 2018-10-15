import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncidentePage } from './incidente';

@NgModule({
  declarations: [
    IncidentePage,
  ],
  imports: [
    IonicPageModule.forChild(IncidentePage),
  ],
})
export class IncidentePageModule {}
