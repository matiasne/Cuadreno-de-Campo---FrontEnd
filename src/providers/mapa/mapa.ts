
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { RegistroPoligono } from '../../models/registroPoligono';
import { ToastController } from 'ionic-angular';
import { GlobalesProvider } from '../globales/globales';
import { Zona } from '../../models/zona';
import { Campo } from '../../models/campo';
import { Lote } from '../../models/lote';
declare var google;
/*
  Generated class for the MapaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export class MapaProvider {

  map: any;

  public pathDibujado:any;

  public seleccionMultiple:boolean = false;
  public registrosSeleccionados:any;

  public usuarioDibujando:boolean = false;
  public dibujoElementoNuevo:boolean = false;
  public tipoNuevoElementoDibujando:String;
  public elementoDibujando:any;
  public poligonoDibujoNuevo:any;

  public  indiceElementoEnEdicion:number;

  public infowindow:any;

  public ZonasBounds:any; 
  public CampoBounds:any;
  public LotesBounds:any;


  private subjectClickPoligono = new Subject<any>();

  constructor(
    /*public _coordenadaPoligonoProvider:CoordenadaPoligonoProvider,
    private toastCtrl: ToastController,
    public _globalesProvider:GlobalesProvider*/
  ) {
    console.log('Hello MapaProvider Provider');
    this.ZonasBounds = new google.maps.LatLngBounds(); 
    this.CampoBounds = new google.maps.LatLngBounds();
    this.LotesBounds = new google.maps.LatLngBounds();
    //this.registrosPoligonos = new Array();
  }

  ElementoClickeado(): Observable<any> {
    return this.subjectClickPoligono.asObservable();
  }

  ObtenerZoomActual(){
    return this.map.getZoom().toString();
  }

  InicializarMapa(idMapa){

    console.log("Inicializando MAPA!!!");
    let mapEle: HTMLElement = document.getElementById(idMapa);
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8,
      fullscreenControl:false,
      fullscreenControlOptions:false,
      streetViewControl:false,
      /*mapTypeId: google.maps.MapTypeId.SATELLITE*/
    });

 

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

    this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });

    searchBox.addListener('places_changed', () => {
      var places = searchBox.getPlaces();

      if(places.length == 0){
        return;
      }

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry){
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };       

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
  

    //Agregamos una funcion al prototipo de Poligono para que retorne los bounds
    google.maps.Polygon.prototype.getBounds = function() {
      var bounds = new google.maps.LatLngBounds();
      if (this.getPath() != undefined){
        this.getPath().forEach(function(element,index){ bounds.extend(element); });
      }
      return bounds;
    }  
    
    google.maps.event.addListener(this.map, 'click', (event) => {  
      //Solo si está en modo edición será agregado el punto
      if(this.usuarioDibujando){ 
        this.pathDibujado.push(event.latLng);
      }
    });
    this.infowindow = new google.maps.InfoWindow();
  } 


 
  DeshacerUltimpoPunto(){
    if(this.pathDibujado.length > 0)
      this.pathDibujado.pop();
  }

  BorrarTodo(elementos){
    elementos.forEach( (item, index) => { 
      if(item.poligono != ""){      
        this.BorrarPoligono(item);  
      }  
    }); 
  }
  
  SacarClickTodo(elementos){      
    elementos.forEach( (item, index) => { 
      if(item.poligono != undefined){
        item.poligono.setOptions({
          clickable: false
        })
      }       
      
    });     
  }
  
  AgregarClickTodo(elementos){
    elementos.forEach( (item, index) => { 
      if(item.poligono != ""){       
        item.poligono.setOptions({
          clickable: true
        })
      }
    }); 
  }

  
  DibujarPoligono(elemento){

    this.map.setOptions({
      draggableCursor: "crosshair"
    })

    this.dibujoElementoNuevo=true;
    this.usuarioDibujando = true;   
    this.pathDibujado = [];

    this.elementoDibujando = elemento; 

    this.poligonoDibujoNuevo = new google.maps.Polygon({
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 3,
      editable: true
    });
    this.poligonoDibujoNuevo.setMap(this.map);
    this.pathDibujado = this.poligonoDibujoNuevo.getPath(); //Inicializmos path solamente  
  }

  ObtenerPoligonoDibujado(){
    console.log("Poligono Dibujado")
    console.log(this.poligonoDibujoNuevo);
    return this.poligonoDibujoNuevo;
  }  

  RedibujarPoligono(elemento){ 
    
    this.map.setOptions({
      draggableCursor: "crosshair"
    })

    this.dibujoElementoNuevo = false;
    this.usuarioDibujando = true; 
    this.elementoDibujando = elemento;
    
    console.log(elemento);
    
    if(elemento.poligono.getPath() == undefined) //Si no tiene poligono dibujado entonces le cargamos uno nuevo en modo edicion
    {
      var poligonoNuevo = new google.maps.Polygon({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        editable: true
      });
      poligonoNuevo.setMap(this.map);
      elemento.poligono = poligonoNuevo; 
    }
    else{ //Si ya tenia poligono lo ponemos en modo edicion
      elemento.poligono.setOptions({
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        editable: true  
      }); 
    }
    this.poligonoDibujoNuevo = elemento.poligono;
    this.pathDibujado = elemento.poligono.getPath();
  }

  

  SalirEdicion(){
    this.map.setOptions({
      draggableCursor: "auto"
    })
    this.usuarioDibujando = false;
    this.poligonoDibujoNuevo.setMap(null); 
  }


  ResetZonaBounds(){
    this.ZonasBounds = new google.maps.LatLngBounds(); 
  }

  ResetCampoBounds(){
    this.CampoBounds = new google.maps.LatLngBounds(); 
  }

  ResetLoteBounds(){
    this.LotesBounds = new google.maps.LatLngBounds(); 
  }

  AgregarZonasBounds(coordenadas){
    this.ZonasBounds.extend({lat: parseFloat(coordenadas.latitud),lng:  parseFloat(coordenadas.longitud)});
  }

  AgregarCampoBounds(coordenadas){
    this.CampoBounds.extend({lat: parseFloat(coordenadas.latitud),lng:  parseFloat(coordenadas.longitud)});
  }

  AgregarLotesBounds(coordenadas){
    this.LotesBounds.extend({lat: parseFloat(coordenadas.latitud),lng:  parseFloat(coordenadas.longitud)});
  }

  //Visualiza Todas las Zonas
  VisualizarZonasBounds(){
    this.map.fitBounds(this.ZonasBounds); //
  }

  //Visualiza Todas las Zonas
  VisualizarCampoBounds(){
    this.map.fitBounds(this.CampoBounds); //
  }

  //Visualiza Todas las Zonas
  VisualizarLotesBounds(){
    this.map.fitBounds(this.LotesBounds); //
  }


  DesenfocarPoligono(elemento){
    if(elemento.tipo=="Zona"){
      elemento.poligono.setOptions({
        paths: elemento.coordenadasPoligono,
        strokeColor: '#444444',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#333333',
        fillOpacity: 0.35, 
        zIndex: 1             
      });
    }
    if(elemento.tipo=="Campo"){
      elemento.poligono.setOptions({
        paths: elemento.coordenadasPoligono,
        strokeColor: '#00838f',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#00838f',
        fillOpacity: 0.35, 
        zIndex: 2            
      });
    }
    if(elemento.tipo=="Lote"){
      elemento.poligono.setOptions({
        paths: elemento.coordenadasPoligono,
        strokeColor: '#00FF00',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#00FF00',
        fillOpacity: 0.35, 
        zIndex: 3            
      });
    }
  }


  ActualizarInfoWindow(elemento){   
    
    var contentString ="";
      if(elemento.tipo == "Zona"){
        contentString = '<div id="content">'+
                              '<div id="siteNotice">'+
                              '</div>'+
                              '<h3 id="firstHeading" class="firstHeading">'+ elemento.tipo+'</h3>'+
                              '<div id="bodyContent">'+
                                '<p><b>'+elemento.nombre+'</b><br> ' +   
                                '</p>' +                          
                              '</div>'+
                            '</div>';
      }

      if(elemento.tipo == "Campo"){
         contentString = '<div id="content">'+
                              '<div id="siteNotice">'+
                              '</div>'+
                              '<h3 id="firstHeading" class="firstHeading">'+ elemento.tipo+'</h3>'+
                              '<div id="bodyContent">'+
                                '<p><b>'+elemento.nombre+'</b><br> ' + 
                                'Hectareas Totales: '+elemento.hectareasTotal+' <br>' +  
                                '</p>' +                            
                              '</div>'+
                            '</div>';
      }

      if(elemento.tipo == "Lote"){
         contentString = '<div id="content">'+
                              '<div id="siteNotice">'+
                              '</div>'+
                              '<h3 id="firstHeading" class="firstHeading">'+ elemento.tipo+'</h3>'+
                              '<div id="bodyContent">'+
                                '<p><b>'+elemento.nombre+'</b><br> ' +  
                                'Hectareas: '+elemento.QT_HECTAREAS+' <br>' +  
                                '</p>' +                          
                              '</div>'+
                            '</div>';
      }
      
      this.infowindow.setContent(contentString);    
      this.infowindow.setPosition(this.map.getCenter());
      this.infowindow.open(this.map); 

  } 

  //Al visualizar no solo hace foco si no que también cambia el color del poligono para
  //que se pueda ver el contenido del mismo  
  FocusPoligono(item){
    
    var pol = new google.maps.Polygon; //Casteo
    pol = item.poligono; 
    
    if (item.poligono != undefined && item.contienePoligono =="si"){
      this.map.fitBounds(item.poligono.getBounds());
    //Hacemos foco 
      pol.setOptions(
        {
          strokeColor: '#0000FF',
          strokeOpacity: 0.4,
          strokeWeight: 1,
          fillColor: '#0000FF',
          fillOpacity: 0.35,              
        }
      );

      this.ActualizarInfoWindow(item);
    }
    else{
      console.log("El elemento no tiene poligono para dibujar");
    }    
  }

  CrearPoligonoCba(){
    
    var cbaCoords = [
      {lat:-33.5994651511,lng:-65.109602406036},
      {lat:-34.9475842054692,lng:-65.09312291384799},
      {lat:-34.989504102765395,lng:-63.392988636504015},
      {lat:-34.409884339469045,lng:-63.366896107207026},
      {lat:-34.39472926460486,lng:-62.90684361697248},
      {lat:-33.49788871160722,lng:-62.22843785525424},
      {lat:-32.82464441005311,lng:-61.768385365020094},
      {lat:-31.717362550616684,lng:-62.187239124786004},
      {lat:-30.67270405710301,lng:-61.85898824815797},
      {lat:-30.50643102596748,lng:-62.12332960671898},
      {lat:-30.337887955685638,lng:-62.22254130162446},
      {lat:-30.244016863989504,lng:-62.54680535220223},
      {lat:-29.969390687335906,lng:-62.673315496529995},
      {lat:-29.81485143797369,lng:-62.806181402292},
      {lat:-29.805795496320815,lng:-63.44517369509799},
      {lat:-29.649809586310166,lng:-63.51603547797697},
      {lat:-29.648377386240256,lng:-63.769270374786004},
      {lat:-29.586296449302193,lng:-63.86265416384799},
      {lat:-29.46680266737967,lng:-64.362532093536},
      {lat:-29.562408987709233,lng:-64.97227330447299},
      {lat:-29.910901120884354,lng:-64.9070419812308},
      {lat:-30.046659503276505,lng:-65.09415288210971},
      {lat:-30.104965144143563,lng:-65.44039387942416},
      {lat:-31.014396823866697,lng:-65.78663487673862},
      {lat:-31.86385924537558,lng:-65.76190490962131},
      {lat:-32.037484875661974,lng:-65.3471602940665},
      {lat:-32.12010606770743,lng:-65.24964590312106},
      {lat:-32.30949695447225,lng:-65.20706315280063},
      {lat:-32.31183639738193,lng:-64.97356076480014},
      {lat:-32.30721185889255,lng:-64.9295725369559},
      {lat:-32.42089788550506,lng:-64.94053740740878},
      {lat:-32.52517811987134,lng:-64.89107747317416},
      {lat:-32.54377492384731,lng:-64.89914555789096},
      {lat:-32.56244021533331,lng:-64.8850693249808},
      {lat:-32.58124627145021,lng:-64.88987584353549},
      {lat:-32.607857332148974,lng:-64.92832799197299},
      {lat:-32.68879886669557,lng:-64.96128697634799},
      {lat:-33.01758868950734,lng:-65.03269810916055},
      {lat:-33.12461396302247,lng:-65.1041092419731},
      {lat:-33.18210059272315,lng:-65.13706822634828}
  ];

    var poligono = new google.maps.Polygon();
    poligono.setOptions({
      paths: cbaCoords,
      strokeColor: '#440000',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#330000',
      fillOpacity: 0.35, 
      zIndex: 1,
      clickable: false             
    });

    poligono.setMap(this.map); 
  }
  
  CrearPoligono(elemento){
    
    var poligono = new google.maps.Polygon();

    if(elemento.tipo=="Zona"){
      poligono.setOptions({
        paths: elemento.coordenadasPoligono,
        strokeColor: '#444444',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#333333',
        fillOpacity: 0.35, 
        zIndex: 1             
      });
    }
    if(elemento.tipo=="Campo"){
      poligono.setOptions({
        paths: elemento.coordenadasPoligono,
        strokeColor: '#00838f',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#00838f',
        fillOpacity: 0.35, 
        zIndex: 2            
      });
    }
    if(elemento.tipo=="Lote"){
      poligono.setOptions({
        paths: elemento.coordenadasPoligono,
        strokeColor: '#00FF00',
        strokeOpacity: 0.8,
        strokeWeight: 1,
        fillColor: '#00FF00',
        fillOpacity: 0.35, 
        zIndex: 3            
      });
    }
    
    poligono.setMap(this.map); 

    elemento.poligono = poligono;
    //this.VisualizarZonasBounds();    
    google.maps.event.addListener(poligono, 'click', event => {      
      if(!this.usuarioDibujando){
        this.subjectClickPoligono.next(elemento);        
      }
    });  
    
      
  }

  BorrarPoligono(elemento){  
    console.log("Borrando poligono de:")
    console.log(elemento);
    if(elemento.poligono != ""){
      var pol = new google.maps.Polygon;
      pol = elemento.poligono;
      if(pol != undefined){
        pol.setMap(null);
        console.log("Poligono Borrado");
      }
      this.infowindow.close();
    }      
  }
}


  


