import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProductoresPage } from '../pages/productores/productores';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoteProvider } from '../providers/lote/lote';
import { ComentarioProvider } from '../providers/comentario/comentario';
import { CoordenadaPoligonoProvider } from '../providers/coordenada-poligono/coordenada-poligono';
import { CultivoProvider } from '../providers/cultivo/cultivo';
import { CampoProvider } from '../providers/campo/campo';
import { HerramientaProvider } from '../providers/herramienta/herramienta';
import { ObservacionProvider } from '../providers/observacion/observacion';
import { PlaguicidaProvider } from '../providers/plaguicida/plaguicida';
import { QuimicoProvider } from '../providers/quimico/quimico';
import { RevisionProvider } from '../providers/revision/revision';
import { TareaProvider } from '../providers/tarea/tarea';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { VisitaProvider } from '../providers/visita/visita';
import { EditVisitaPage } from '../pages/edit-visita/edit-visita';
import { EditTareaPage } from '../pages/edit-tarea/edit-tarea';
import { EditObservacionPage } from '../pages/edit-observacion/edit-observacion';
import { EditComentarioPage } from '../pages/edit-comentario/edit-comentario';
import { EditCampoPage } from '../pages/edit-campo/edit-campo';
import { CosechaProvider } from '../providers/cosecha/cosecha';
import { EditRevisionPage } from '../pages/edit-revision/edit-revision';
import { EditLotePage } from '../pages/edit-lote/edit-lote';
import { EditCosechasPage } from '../pages/edit-cosechas/edit-cosechas';
import { ProblemasProvider } from '../providers/problemas/problemas';
import { ListaProblemasPage } from '../pages/lista-problemas/lista-problemas';
import { EditProblemaPage } from '../pages/edit-problema/edit-problema';
import { ConfiguracionesPage } from '../pages/configuraciones/configuraciones';
import { ZonaProvider } from '../providers/zona/zona';
import { ZonasPage } from '../pages/zonas/zonas';
import { EditZonaPage } from '../pages/edit-zona/edit-zona';
import { MapaProvider } from '../providers/mapa/mapa';
import { BuscarPage } from '../pages/buscar/buscar';
import { LoaderProvider } from '../providers/loader/loader';
import { CampoPage } from '../pages/campo/campo';
import { ListPage } from '../pages/list/list';
import { HistorialProvider } from '../providers/historial/historial';
import { HistorialPage } from '../pages/historial/historial';
import { ClimaticoPage } from '../pages/climatico/climatico';
import { GlobalesProvider } from '../providers/globales/globales';
import { EstadisticasPage } from '../pages/estadisticas/estadisticas';
import { RegistroVisitaPage } from '../pages/registro-visita/registro-visita';
import { LluviaProvider } from '../providers/lluvia/lluvia';
import { ProductosProvider } from '../providers/productos/productos';
import { SubgruposProvider } from '../providers/subgrupos/subgrupos';
import { GruposProvider } from '../providers/grupos/grupos';
import { RegistroPage } from '../pages/registro/registro';
import { EditUsuariosPage } from '../pages/edit-usuarios/edit-usuarios';
import { ConceptosProvider } from '../providers/conceptos/conceptos';
import { EntidadesProvider } from '../providers/entidad/entidad';
import { AgregarProductoPage } from '../pages/agregar-producto/agregar-producto';
import { ProductosAgregadoProvider } from '../providers/producto-agregado/producto-agregado';
import { EditUserPage } from '../pages/edit-user/edit-user';
import { FileUploaderService } from '../providers/file-uploader/file-uploader.service';
import {  HttpClient, HttpClientModule } from '@angular/common/http';
import { VariedadProvider } from '../providers/variedad/variedad';
import { MarcadoresProvider } from '../providers/marcadores/marcadores';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProductoresPage,
    EditVisitaPage,
    EditTareaPage,
    EditObservacionPage,
    EditComentarioPage,
    EditCampoPage,
    EditRevisionPage,
    EditLotePage,
    EditCosechasPage,
    ListaProblemasPage,
    EditProblemaPage,
    ConfiguracionesPage,
    ZonasPage,
    EditZonaPage,
    BuscarPage,
    CampoPage,
    ListPage,
    HistorialPage,
    ClimaticoPage,
    EstadisticasPage,
    RegistroVisitaPage,
    RegistroPage,
    EditUsuariosPage,
    AgregarProductoPage,
    EditUserPage,
    
  ],  
  imports: [
    HttpClientModule,
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [ 
    MyApp,
    HomePage,
    ProductoresPage,
    EditVisitaPage,
    EditTareaPage,
    EditObservacionPage,
    EditComentarioPage,
    EditCampoPage,
    EditRevisionPage,
    EditLotePage,
    EditCosechasPage,
    ListaProblemasPage,
    EditProblemaPage,
    ConfiguracionesPage,
    ZonasPage,
    EditZonaPage,
    BuscarPage,
    CampoPage,
    ListPage,
    HistorialPage,
    ClimaticoPage,
    EstadisticasPage,
    RegistroVisitaPage,
    RegistroPage,
    EditUsuariosPage,
    AgregarProductoPage,
    EditUserPage,
    
    
  ],
  providers: [ 
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalesProvider,
    LoteProvider,
    ComentarioProvider,
    CoordenadaPoligonoProvider,
    CultivoProvider,
    CampoProvider,
    HerramientaProvider,
    ObservacionProvider,
    PlaguicidaProvider,
    QuimicoProvider,
    RevisionProvider,
    TareaProvider,
    UsuarioProvider,
    VisitaProvider,
    CosechaProvider,
    ProblemasProvider,
    ZonaProvider,
    MapaProvider,
    LoaderProvider,
    HistorialProvider,
    LluviaProvider,
    ProductosProvider,
    SubgruposProvider,
    GruposProvider,
    ConceptosProvider,
    EntidadesProvider,
    ProductosAgregadoProvider,
    FileUploaderService,
    HttpClient,
    VariedadProvider,
    MarcadoresProvider,
    
  ]
})
export class AppModule {}
