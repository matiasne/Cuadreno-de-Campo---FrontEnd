
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
  public usuarioAgregandoMarcador:boolean = false;
  //public dibujoElementoNuevo:boolean = false;
  public tipoNuevoElementoDibujando:String;
  public elementoDibujando:any;  
  public poligonoDibujoNuevo:any;

  public elementoAgregandoMarcador:any;
  public marcadorNuevo:any;
  public marcadorActual:any;

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
      mapTypeId: google.maps.MapTypeId.SATELLITE
    });    

    var ctaLayer = new google.maps.KmlLayer({
      url: 'http://www.google.com/maps/d/u/0/kml?mid=1NVbLjD5OM2IvUcAwDlBqQH8OzBq5Az0g',
      map: this.map
    });

 

    var input = document.getElementById('pac-input');
    //var searchBox = new google.maps.places.SearchBox(input);
    this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

    /*this.map.addListener('bounds_changed', () => {
      searchBox.setBounds(this.map.getBounds());
    });*/

    /*searchBox.addListener('places_changed', () => {
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
    });*/
  

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

      if(this.usuarioAgregandoMarcador){ 
        if(this.marcadorNuevo != undefined)
          this.marcadorNuevo.setMap(null);
        
        this.marcadorNuevo = new google.maps.Marker({
          position: event.latLng, 
          map: this.map
        });        
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

    //this.dibujoElementoNuevo=true;
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

  ObtenerMarcadorSeleccionado(){
    return this.marcadorNuevo;
  }

  RedibujarPoligono(elemento){ 
    
    this.map.setOptions({
      draggableCursor: "crosshair"
    });

    //this.dibujoElementoNuevo = false;
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

  RedibujarPunto(elemento){
    this.map.setOptions({
      draggableCursor: "crosshair"
    });

    this.elementoAgregandoMarcador = elemento;
    this.usuarioAgregandoMarcador = true;

    

  }

  

  SalirEdicionDibujo(){
    
    this.map.setOptions({
      draggableCursor: "auto"
    })
    this.usuarioDibujando = false;
    this.poligonoDibujoNuevo.setMap(null); 
  }

  SalirEdicionMarcador(){
    console.log("Saliendo edicion de punto");
    this.map.setOptions({
      draggableCursor: "auto"
    })
    this.usuarioAgregandoMarcador = false;
    this.marcadorNuevo.setMap(null);
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
    if(elemento.tipo=="Zona" && elemento.poligono!=undefined){
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


    if(elemento.tipo=="Campo" && elemento.poligono!=undefined ){
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
    if(elemento.tipo=="Lote" && elemento.poligono!=undefined){
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

  AddMarcadorCampo(lat,lng){   

      if(lat != undefined && lng != undefined){
        this.marcadorActual = new google.maps.Marker({
          position: new google.maps.LatLng( lat,lng),
          map: this.map
        });
      }
     
  }

  RemoverUltimoMarcador(){
    if(this.marcadorActual != undefined)
      this.marcadorActual.setMap(null);
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
    

    var CordobaCoordenadas = [
      {lat:-34.99388065400157,lng:-65.11200556476837},
      {lat:-34.984880013060526,lng:-63.39264521320587},
      {lat:-34.41131766984349,lng:-63.39264521320587},
      {lat:-34.397720952871666,lng:-62.90924677570587},
      {lat:-33.59562792891967,lng:-62.28234673297959},
      {lat:-33.33685962723467,lng:-62.074945751024416},
      {lat:-33.30013760431426,lng:-62.063959422899416},
      {lat:-33.279474668946605,lng:-62.028253856493166},
      {lat:-33.25651011410494,lng:-62.014520946336916},
      {lat:-33.215158701743,lng:-61.989801708055666},
      {lat:-33.18758023166937,lng:-61.954096141649416},
      {lat:-33.12549692430226,lng:-61.923883739305666},
      {lat:-33.107093432456715,lng:-61.896417918993166},
      {lat:-33.077179535991746,lng:-61.866205516649416},
      {lat:-33.047255463731005,lng:-61.830499950243166},
      {lat:-33.01041187414825,lng:-61.792047801805666},
      {lat:-32.980465119003995,lng:-61.792047801805666},
      {lat:-32.9090126318632,lng:-61.781061473680666},
      {lat:-32.872111344240615,lng:-61.792047801805666},
      {lat:-32.8213469873238,lng:-61.778314891649416},
      {lat:-32.7844092222832,lng:-61.789301219774416},
      {lat:-32.76131532679314,lng:-61.808527293993166},
      {lat:-32.73821543983106,lng:-61.805780711961916},
      {lat:-32.73128430573437,lng:-61.835993114305666},
      {lat:-32.6966205518193,lng:-61.866205516649416},
      {lat:-32.6919977003006,lng:-61.915643993211916},
      {lat:-32.67119190621889,lng:-61.954096141649416},
      {lat:-32.63881770583523,lng:-61.943109813524416},
      {lat:-32.615686100929494,lng:-61.899164501024416},
      {lat:-32.58329181231187,lng:-61.890924754930666},
      {lat:-32.57866310074712,lng:-61.918390575243166},
      {lat:-32.56014586508291,lng:-61.901911083055666},
      {lat:-32.53467842536003,lng:-61.926630321336916},
      {lat:-32.51383605635291,lng:-61.907404247118166},
      {lat:-32.44200868479655,lng:-61.940363231493166},
      {lat:-32.36902714808195,lng:-61.998041454149416},
      {lat:-32.25296221934594,lng:-62.036493602586916},
      {lat:-32.20649463690591,lng:-62.129877391649416},
      {lat:-32.16232843477193,lng:-62.173822704149416},
      {lat:-32.113488240210756,lng:-62.198541942430666},
      {lat:-32.048327316634335,lng:-62.176569286180666},
      {lat:-31.990108687531677,lng:-62.179315868211916},
      {lat:-31.922528758885914,lng:-62.195795360399416},
      {lat:-31.892218172965844,lng:-62.231500926805666},
      {lat:-31.840900599971505,lng:-62.236994090868166},
      {lat:-31.8012265494169,lng:-62.212274852586916},
      {lat:-31.74518711602039,lng:-62.217768016649416},
      {lat:-31.70079849831721,lng:-62.253473583055666},
      {lat:-31.600254851245175,lng:-62.12712287718091},
      {lat:-31.35195608094591,lng:-62.03923225218091},
      {lat:-30.666935413383303,lng:-61.83323859983716},
      {lat:-30.648033856226323,lng:-61.98155402952466},
      {lat:-30.593671299204274,lng:-61.98430061155591},
      {lat:-30.586578280641888,lng:-62.02824592405591},
      {lat:-30.48248774436292,lng:-62.12712287718091},
      {lat:-30.326143075713755,lng:-62.18205451780591},
      {lat:-30.323772292847664,lng:-62.52263068968091},
      {lat:-30.27397260200836,lng:-62.58305549436841},
      {lat:-30.214654296672723,lng:-62.58854865843091},
      {lat:-30.193290944295654,lng:-62.57206916624341},
      {lat:-30.1647992635203,lng:-62.59129524046216},
      {lat:-30.091157642474457,lng:-62.55558967405591},
      {lat:-30.06025933251971,lng:-62.56382942014966},
      {lat:-30.050750219204733,lng:-62.64348029905591},
      {lat:-30.022217401255485,lng:-62.67094611936841},
      {lat:-29.967506546786527,lng:-62.70939826780591},
      {lat:-29.94132982972847,lng:-62.75609016233716},
      {lat:-29.898480341089343,lng:-62.77531623655591},
      {lat:-29.86990377331477,lng:-62.79454231077466},
      {lat:-29.841319017481332,lng:-62.81376838499341},
      {lat:-29.81510913572601,lng:-62.79454231077466},
      {lat:-29.807959793244066,lng:-62.84398078733716},
      {lat:-29.767437200469637,lng:-63.45921516233716},
      {lat:-29.722127838540008,lng:-63.46196174436841},
      {lat:-29.71974256821704,lng:-63.49492072874341},
      {lat:-29.662906188921504,lng:-63.47548501746542},
      {lat:-29.655745989496918,lng:-63.51943032996542},
      {lat:-29.639036876218853,lng:-63.61281411902792},
      {lat:-29.65813277925413,lng:-63.70619790809042},
      {lat:-29.655745989496918,lng:-63.75014322059042},
      {lat:-29.598446058185363,lng:-63.80232827918417},
      {lat:-29.596280193938977,lng:-63.77774672562765},
      {lat:-29.572395095080264,lng:-63.7859864717214},
      {lat:-29.56522846327256,lng:-63.820318747112026},
      {lat:-29.562839472988564,lng:-63.858770895549526},
      {lat:-29.616578082458545,lng:-63.894476461955776},
      {lat:-29.615384202131278,lng:-63.963141012737026},
      {lat:-29.57358948426722,lng:-63.95902113969015},
      {lat:-29.544920245030116,lng:-63.98099379594015},
      {lat:-29.5007059014109,lng:-64.33804946000265},
      {lat:-29.56045042620189,lng:-64.8241944795339},
      {lat:-29.583144089095143,lng:-64.9670167451589},
      {lat:-29.907931739176746,lng:-64.91297452315621},
      {lat:-30.058998549093207,lng:-65.11759488448433},
      {lat:-30.11593268452697,lng:-65.40049283370308},
      {lat:-31.04048603575969,lng:-65.77677457198433},
      {lat:-31.860553412677007,lng:-65.77402798995308},
      {lat:-31.882419191478093,lng:-65.67623318693148},
      {lat:-31.887083504623607,lng:-65.65151394865023},
      {lat:-32.03155995414221,lng:-65.33291043302523},
      {lat:-32.04912155663388,lng:-65.28896512052523},
      {lat:-32.07588946759158,lng:-65.27797879240023},
      {lat:-32.08636173490638,lng:-65.26012600919711},
      {lat:-32.10148622480965,lng:-65.24913968107211},
      {lat:-32.11544506977775,lng:-65.25325955411898},
      {lat:-32.11939084460205,lng:-65.25289586579885},
      {lat:-32.12601584041644,lng:-65.2479075030841},
      {lat:-32.13078186040726,lng:-65.24198009418762},
      {lat:-32.13607203649631,lng:-65.24313626278627},
      {lat:-32.139007721906054,lng:-65.2389078285309},
      {lat:-32.14687086497925,lng:-65.23919687068059},
      {lat:-32.1522555424085,lng:-65.2379681007398},
      {lat:-32.16047015604922,lng:-65.23460713373817},
      {lat:-32.1645771852015,lng:-65.2360165550225},
      {lat:-32.17331473411144,lng:-65.23843787943417},
      {lat:-32.18087961281828,lng:-65.2389618961322},
      {lat:-32.18872965428261,lng:-65.23956722723517},
      {lat:-32.19643137345738,lng:-65.2395265700327},
      {lat:-32.20638262989597,lng:-65.23778962766193},
      {lat:-32.21019591811173,lng:-65.23245796067579},
      {lat:-32.21733096887277,lng:-65.22704554515144},
      {lat:-32.22554537543593,lng:-65.22536930565104},
      {lat:-32.229402792439416,lng:-65.22094648411934},
      {lat:-32.2391314570477,lng:-65.21613996556465},
      {lat:-32.248568718217136,lng:-65.2130500607795},
      {lat:-32.26918209280804,lng:-65.21579664281074},
      {lat:-32.290661472513314,lng:-65.2137367062873},
      {lat:-32.316197896305944,lng:-65.21270673802559},
      {lat:-32.307740019038604,lng:-65.13534638611753},
      {lat:-32.3139568917481,lng:-65.06027399824944},
      {lat:-32.31126212290146,lng:-65.02891761388571},
      {lat:-32.31687842164136,lng:-64.97753385529757},
      {lat:-32.312722943082555,lng:-64.95939507658943},
      {lat:-32.304139564261895,lng:-64.94696395857255},
      {lat:-32.31644821705501,lng:-64.92629309446193},
      {lat:-32.34267919099481,lng:-64.9166085584763},
      {lat:-32.3627520117578,lng:-64.92137932759289},
      {lat:-32.385544281398566,lng:-64.92513800316681},
      {lat:-32.401576330339616,lng:-64.93525708704749},
      {lat:-32.41586659328923,lng:-64.94056965237354},
      {lat:-32.432673663143234,lng:-64.93672315321822},
      {lat:-32.4442625255847,lng:-64.92807013550822},
      {lat:-32.455851171898125,lng:-64.93150336304723},
      {lat:-32.47243847878423,lng:-64.92696725803006},
      {lat:-32.47757860075307,lng:-64.91228609731161},
      {lat:-32.480148551675626,lng:-64.90151228941335},
      {lat:-32.48664642286034,lng:-64.896812030972},
      {lat:-32.49337017142483,lng:-64.8965218382748},
      {lat:-32.497890113793126,lng:-64.90667642454338},
      {lat:-32.50941528217982,lng:-64.9151869452167},
      {lat:-32.51923031341974,lng:-64.91120245945967},
      {lat:-32.52355846977991,lng:-64.90371705251863},
      {lat:-32.522827696857846,lng:-64.88898802092308},
      {lat:-32.52825178430208,lng:-64.88299679614096},
      {lat:-32.536752633519335,lng:-64.89030086636706},
      {lat:-32.54968503827938,lng:-64.90081935655826},
      {lat:-32.56309526266701,lng:-64.88547923641949},
      {lat:-32.571535589747924,lng:-64.88055575838132},
      {lat:-32.58327723432733,lng:-64.88976699299508},
      {lat:-32.59898205603797,lng:-64.89711919233321},
      {lat:-32.61030389972253,lng:-64.90903503809602},
      {lat:-32.61451836558687,lng:-64.9246059980868},
      {lat:-32.6264570835611,lng:-64.93033154155876},
      {lat:-32.64167747421751,lng:-64.92770114923223},
      {lat:-32.6487085489601,lng:-64.94011886322522},
      {lat:-32.662051527040354,lng:-64.94014791065143},
      {lat:-32.66756621773019,lng:-64.93329597928636},
      {lat:-32.683616714483286,lng:-64.9312433046195},
      {lat:-32.69395234624221,lng:-64.92472380322351},
      {lat:-32.70258659787716,lng:-64.93794354471305},
      {lat:-32.72770088210091,lng:-64.95210651604373},
      {lat:-32.73852267879574,lng:-64.95644141967784},
      {lat:-32.75548303543118,lng:-64.95448899844803},
      {lat:-32.782148406152295,lng:-64.95522940160265},
      {lat:-32.793746476761285,lng:-64.96177941275027},
      {lat:-32.807047893359055,lng:-64.97054758238659},
      {lat:-32.82466174326731,lng:-64.97287173068128},
      {lat:-32.843563478123315,lng:-64.96991393178178},
      {lat:-32.875506232424016,lng:-64.97598813291796},
      {lat:-32.88051766058589,lng:-64.98657833407196},
      {lat:-32.891672321711056,lng:-64.9760805879693},
      {lat:-32.903590828896355,lng:-64.99143108015238},
      {lat:-32.917619539717464,lng:-65.0039128447986},
      {lat:-32.93846463943623,lng:-65.0050038858131},
      {lat:-32.9575279664393,lng:-65.01172921589068},
      {lat:-32.960144806181624,lng:-65.0233316270232},
      {lat:-32.967790299018944,lng:-65.02981947809724},
      {lat:-32.9750690572488,lng:-65.02413701203272},
      {lat:-32.98158820600285,lng:-65.01099609638328},
      {lat:-32.99118302337427,lng:-65.01884519422265},
      {lat:-33.00980045318971,lng:-65.0172765790798},
      {lat:-33.03292448288477,lng:-65.02679195412554},
      {lat:-33.04764984964552,lng:-65.03807277397266},
      {lat:-33.05558711806962,lng:-65.05195292998997},
      {lat:-33.07221514101622,lng:-65.05271319842831},
      {lat:-33.08052797432955,lng:-65.05652656018651},
      {lat:-33.086410027494274,lng:-65.06323975962033},
      {lat:-33.095966440641625,lng:-65.06144651802862},
      {lat:-33.10534582458879,lng:-65.05643002418594},
      {lat:-33.11463622157012,lng:-65.05804165031145},
      {lat:-33.12963205390539,lng:-65.05060771728046},
      {lat:-33.14230361127832,lng:-65.05581714236655},
      {lat:-33.14748890183053,lng:-65.06803489201894},
      {lat:-33.14433236571683,lng:-65.0816968674311},
      {lat:-33.13930437231994,lng:-65.08990114615278},
      {lat:-33.1471392055004,lng:-65.10704955016206},
      {lat:-33.15910433041028,lng:-65.11219052462764},
      {lat:-33.17083398692275,lng:-65.12506069447761},
      {lat:-33.17554879249032,lng:-65.13492900694166},
      {lat:-33.187675547255495,lng:-65.146042972744},
      {lat:-33.19546208286783,lng:-65.14748008259829},
      {lat:-33.195778598745186,lng:-65.14342402839009},
      {lat:-33.31348990448045,lng:-65.13793086432759},
      {lat:-33.69218233540362,lng:-65.12076472663227},

    ]

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
      paths: CordobaCoordenadas,
      strokeColor: '#440000',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: '#330000',
      fillOpacity: 0.10, 
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


  


