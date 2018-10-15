
import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Zona } from '../../models/zona';
import { Campo } from '../../models/campo';
import { Lote } from '../../models/lote';
import { Cosecha } from '../../models/cosecha';
import { MapaProvider } from '../mapa/mapa';
import { CoordenadaPoligonoProvider } from '../coordenada-poligono/coordenada-poligono';
import { ZonaProvider } from '../zona/zona';
import { CampoProvider } from '../campo/campo';
import { LoteProvider } from '../lote/lote';
import { LoaderProvider } from '../loader/loader';
import { RevisionProvider } from '../revision/revision';
import { CosechaProvider } from '../cosecha/cosecha';
import { ProductosProvider } from '../productos/productos';
import { SubgruposProvider } from '../subgrupos/subgrupos';
import { Producto } from '../../models/producto';
import { Subgrupo } from '../../models/subgrupo';
import { GruposProvider } from '../grupos/grupos';
import { Grupo } from '../../models/grupos';
import { Concepto } from '../../models/concepto';
import { ConceptosProvider } from '../conceptos/conceptos';
import { Entidad } from '../../models/entidad';
import { EntidadesProvider } from '../entidad/entidad';

/*
  Generated class for the SeleccionadoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobalesProvider {


  public elementos:any; //Lista de todos los elementos que se obtuvieron del servidor
 
  public subscriptionElementoClick: Subscription;

  public elementoSeleccionado:any;
  public elementoEnCreacion:any;

  public subsElementoSeleccionado = new Subject<any>();
  public subsCosechas = new Subject<any>();
  public subsIngenieros = new Subject<any>();
  public subsContratistas = new Subject<any>();
  public subsZonas = new Subject<any>();
  public subsUsuarioLogueado = new Subject<any>();

  /*public cosechas:Cosecha[];*/
  public CosechaSeleccionada:Cosecha;

  public productos:Producto[];
  public conceptos:Concepto[];

  public ingenieros:Entidad[];
  public IngenieroSeleccionado:Entidad;

  public contratistas:Entidad[];
  public ContratistaSeleccionado:Entidad;

  constructor(
    public _mapaProvider:MapaProvider,
    public _coordenadaPoligonoProvider:CoordenadaPoligonoProvider,
    public _zonaProvider:ZonaProvider,
    public _campoProvider:CampoProvider,
    public _loteProvider:LoteProvider,
    public _loaderProvider:LoaderProvider,
    public _revisionProvider:RevisionProvider,
    public _cosechaProvider:CosechaProvider,
    public _productosProvider:ProductosProvider,
    public _subgruposProvider:SubgruposProvider,
    public _gruposProvider:GruposProvider,
    public _conceptosProvider:ConceptosProvider,
    public _entidadesProvider:EntidadesProvider
  ) {
    this.elementos = new Array();
    this.CosechaSeleccionada = new Cosecha(0,"","","","","");
    
    this.subscriptionElementoClick = this._mapaProvider.ElementoClickeado().subscribe(
      data=>{        
        this.SetearElementoSeleccionado(this.GetElementoByID(data));
      }
    ) 
    
  


  }

  public Inicializar(){
    this._mapaProvider.InicializarMapa('mapZonas');
   
    this._mapaProvider.CrearPoligonoCba();
    
    this.ObtenerCosechas();
    this.ObtenerProductos();
    this.ObtenerConceptos();
  }

  private ObtenerCosechas(){
    this._cosechaProvider.getAll().subscribe(
      response=>{
        var cosechas = response.data;
        if(cosechas != undefined){
          console.log(cosechas);
          this.subsCosechas.next(cosechas); //Para el combo selector
          this.SetearCosechaSeleccionada(cosechas[cosechas.length-1]);
          this.ObtenerIngenieros();
        }
        else{
          this._loaderProvider.loaderOFF();
        } 
      },
      error=>{

      }
    )
  }

  public ObtenerIngenieros(){
    console.log("Obteneniendo ingenieros...");
    this._entidadesProvider.getAllIngenieros().subscribe(
      response=>{
        console.log(response);

        this.ingenieros = response.data;        
        if(this.ingenieros != undefined){
          console.log(this.ingenieros);
          this.subsIngenieros.next(this.ingenieros); //Para el combo selector
          this.SetearIngenieroSeleccionado(this.GetIngenieroByID(localStorage.getItem("idEntidadLogueadaSQL")));
          this.ObtenerDesdeServidor();
        }
        else{
          this._loaderProvider.loaderOFF();
        } 
        
      },
      error=>{
        console.log(error);
      }
    )


    this._entidadesProvider.getAllContratistas().subscribe(
      response=>{
        console.log(response);

        this.contratistas = response.data;
        console.log(response.data);
        if(this.contratistas != undefined){
          console.log(this.contratistas);
          this.subsContratistas.next(this.contratistas); //Para el combo selector          
        }
        else{
          this._loaderProvider.loaderOFF();
        } 
        
      },
      error=>{
        console.log(error);
      }
    )
  }

  public SetearUsuarioLogueado(usuario){
    console.log("Seteando usuario!");
    console.log(usuario);
    this.subsUsuarioLogueado.next(usuario); //Para el combo selector
  }

  public SetearIngenieroSeleccionado(item:Entidad){
    
    if(item != undefined){ //Puede que no sea un ingeniero por lo cual no se seleccionará nada de aquí   
      this.IngenieroSeleccionado = item;
      console.log("Id entidad seleccionada: "+item.ID_ENTIDAD); 
    }
    else{
      this.IngenieroSeleccionado = this.ingenieros[0];
    }
    
  } 

  public GetIngeniroByID(id){
    var entidad = this.ingenieros.find(item => item.ID_ENTIDAD === id);  
    return entidad;     
  }

  public GetContratistaByID(id){
    var entidad = this.contratistas.find(item => item.ID_ENTIDAD === id);  
    return entidad;     
  }

  public GetEntidadByID(id){
    var entidad = this.GetIngenieroByID(id)

    if(entidad == undefined)
      entidad = this.GetContratistaByID(id);
    
      return entidad;
  }

  private ObtenerProductos(){
    this._productosProvider.getAll().subscribe(
      response=>{
        this.productos = response.data;
        console.log("productos");
        console.log(this.productos);
      },
      error=>{
        console.log(error);
      }
    )
  }

  private ObtenerConceptos(){
    this._conceptosProvider.getAll().subscribe(
      response=>{
        this.conceptos = response.data;
        console.log("conceptos");
        console.log(this.conceptos);
      },
      error=>{
        console.log(error);
      }
    )
  }

  public GetConceptoByID(id){
    var concepto = this.conceptos.find(item => item.ID_GRW_CONCEPTO === id);  
    return concepto;  
    
  }

  public GetIngenieroByID(id){
    
    var entidad = this.ingenieros.find(item => item.ID_ENTIDAD === id);  
    console.log(entidad);
    return entidad;  
    
  }

  
  
  ObsElementoSeleccionado():Observable<any>{
    return this.subsElementoSeleccionado.asObservable();
  }

  ObsCosechas():Observable<any>{
    return this.subsCosechas.asObservable();
  }

  ObsIngenieros():Observable<any>{
    return this.subsIngenieros.asObservable();
  }

  ObsContratistas():Observable<any>{
    return this.subsContratistas.asObservable();
  }

  ObsZonas():Observable<any>{
    return this.subsZonas.asObservable();
  }

  ObsUsuarioLogueado():Observable<any>{
    return this.subsUsuarioLogueado.asObservable();
  }

  public ObenterElementoByTipoID(tipo,id){
    var elemento = this.elementos.find(item =>{ 
      if(tipo == "Zona"){
         
         if(item.ID_LUGAR_ZONA === id)
           return item
      }
      if(tipo == "Campo"){
        if(item.CD_CAMPO === id )
          return item
      }
      if(tipo == "Lote"){
        if(item.CD_LOTE === id )
          return item
      }
      return 
    });
    return elemento;
  }

  private BorrarTodo(){
    this._mapaProvider.BorrarTodo(this.elementos);
    this.elementos = [];      
  }


  public ObtenerSoloZonas(){
    var zonas = this.elementos.filter( elemento => elemento.tipo === "Zona");
    return zonas;
  }

  public ObtenerSoloLotes(){
    var lotes = this.elementos.filter( elemento => elemento.tipo === "Lote");
    return lotes;
  }

  //Se agregan al array de elementos pero solo los lotes de la campoaña
  //Seleccionada se dibujan
  private AgregarElemento(elemento){
    
    this._mapaProvider.CrearPoligono(elemento); //Creo el poligono  
    
    //Aca fijarme si existe primero
    var existe = this.GetElementoByID(elemento);

    if(existe == undefined){      
      this.elementos.push(elemento); 
    }  
    
    if(elemento.tipo == "Zona")
      this.subsZonas.next(this.ObtenerSoloZonas());

  }


  private BorrarElemento(elemento){
    this._mapaProvider.BorrarPoligono(elemento);  
    this.elementos.forEach((item,index) =>{
      
      if(elemento.tipo == "Zona"){
        console.log(elemento.tipo+" "+item.ID_LUGAR_ZONA+" "+elemento.ID_LUGAR_ZONA);
        if(item.ID_LUGAR_ZONA === elemento.ID_LUGAR_ZONA)
        this.elementos.splice(index,1); 
      }
      if(elemento.tipo == "Campo"){
        if(item.CD_CAMPO === elemento.CD_CAMPO )
        this.elementos.splice(index,1); 
      }
      if(elemento.tipo == "Lote"){
        if(item.CD_LOTE === elemento.CD_LOTE )
        this.elementos.splice(index,1); 
      }
     

      
    })
  }

  private GetElementoByID(elem){    
    var elemento = this.elementos.find(item =>{ 
      if(elem.tipo == "Zona"){
         if(item.ID_LUGAR_ZONA === elem.ID_LUGAR_ZONA)
         return item
      }
      if(elem.tipo == "Campo"){
        if(item.CD_CAMPO === elem.CD_CAMPO )
        return item
      }
      if(elem.tipo == "Lote"){
        if(item.CD_LOTE === elem.CD_LOTE )
        return item
      }
      return 
    });
    return elemento;
  } 

  public SetearCosechaSeleccionada(item:Cosecha){
    console.log("Id cosecha seleccionada: "+item.ID_COSECHA);    
    this.CosechaSeleccionada = item;
    //this.ObtenerDesdeServidor();
  } 

  public ObtenerContenedorElemento(elemento){
    
    if(elemento.tipo == "Campo"){
     
      var zonaContenedora = this.ObenterElementoByTipoID("Zona",elemento.ID_LUGAR_ZONA);
      console.log("Contenedor: ");
      console.log(zonaContenedora);
      return zonaContenedora;
      
    }
    if(elemento.tipo == "Lote"){    

      var campoContenedor = this.ObenterElementoByTipoID("Campo",elemento.CD_CAMPO);
      console.log("Contenedor: ");
      console.log(campoContenedor);
      return campoContenedor;

    }
  }

  public SetearElementoSeleccionado(elemento){   

    
    if(elemento != undefined){

      if(this.elementoSeleccionado != undefined)
        this._mapaProvider.DesenfocarPoligono(this.elementoSeleccionado);

      this.subsElementoSeleccionado.next(elemento);
      this.elementoSeleccionado = elemento;

      

      console.log("Elemento Seleccionado:")
      console.log(this.elementoSeleccionado);      
    
      this._mapaProvider.FocusPoligono(elemento);  
    }
  }

  public BorrarDibujoSeleccionado(){
    this.BorrarDibujoServidor(this.elementoSeleccionado);      
  }

  //Aquí el elemento es editado y no tiene aún coordenadas
  //Siguiente paso es GuardarEnServidor
  public CrearElementoNuevo(elemento){
    this.elementoEnCreacion = elemento; 
    console.log("Elemento en creacion:") 
    console.log(this.elementoEnCreacion);     
    this._mapaProvider.SacarClickTodo(this.elementos);
    this._mapaProvider.DibujarPoligono(elemento);
  }

  public RedibujarElementoSeleccionado(){
    this.elementoEnCreacion = this.elementoSeleccionado;
    this._mapaProvider.SacarClickTodo(this.elementos);
    this._mapaProvider.RedibujarPoligono(this.elementoEnCreacion);
  }

  public CancelarEdicion(){
    this._mapaProvider.SalirEdicion();
    this._mapaProvider.CrearPoligono(this.elementoSeleccionado);
    this._mapaProvider.AgregarClickTodo(this.elementos);
  }


  obtenerFechaFormateada(date:Date){
    
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();

    return yyyy+"-"+mm+"-"+dd;
  }

  private GuardarRevisionLote(lote:Lote)
  {
    //Debo guardar la revision de este lote
    lote.ultimaRevision.fecha = this.obtenerFechaFormateada(new Date());
    lote.ultimaRevision.idLote = lote.CD_CAMPO;
    this._revisionProvider.put(lote.ultimaRevision).subscribe(
      response =>{              
        console.log(response);
      },
      error =>{                
        console.log(<any>error);
      }
    )
  }

  public GuardarPoligonoEnServidor(){

    this.elementoEnCreacion.poligono = this._mapaProvider.ObtenerPoligonoDibujado();
    this.elementoEnCreacion.coordenadasPoligono = this.elementoEnCreacion.poligono.getPath();

    console.log(this.elementoEnCreacion);

    this.elementoEnCreacion.contienePoligono = "si";
    this._coordenadaPoligonoProvider.GuardarDibujo(this.elementoEnCreacion);        

    console.log(this.elementos);
    
    this.AgregarElemento(this.elementoEnCreacion);
    this._mapaProvider.SalirEdicion();
    this._mapaProvider.AgregarClickTodo(this.elementos);    
    this.subsElementoSeleccionado.next(undefined);
  }


  public BorrarDibujoServidor(elemento){

    elemento.poligono = "";
    elemento.coordenadasPoligono = []; //Borramos si es que había poligono guardado en el elemento

    if(elemento.tipo == "Zona"){
      this._coordenadaPoligonoProvider.deleteByZona(elemento.ID_LUGAR_ZONA).subscribe(
        response => {         
            this._mapaProvider.BorrarPoligono(elemento);
            console.log(response.message);
            elemento.contienePoligono = "no";
           
        },
        error => {
          console.log(<any>error);	  
        }
      )
    }

    if(elemento.tipo == "Campo"){
      this._coordenadaPoligonoProvider.deleteByCampo(elemento.CD_CAMPO).subscribe(
        response => {
          this._mapaProvider.BorrarPoligono(elemento);
          elemento.contienePoligono = "no";
          
          console.log(response.message);
        },
        error => {
          console.log(<any>error);	  
        }
      )
    }

    if(elemento.tipo == "Lote"){
      this._coordenadaPoligonoProvider.deleteByLote(elemento.CD_LOTE).subscribe(
        response => {
          
          this._mapaProvider.BorrarPoligono(elemento);    
          
          console.log(response.message);

          elemento.contienePoligono = "no";
          

        },
        error => {
          console.log(<any>error);	  
        }
      )
    }
  }

  FiltrarLotesPorCosecha(id){
    var lotes = this.elementos.filter( elemento => elemento.ID_COSECHA === id);
    return lotes;
  }


  public ObtenerDesdeServidor(){

    
    this.BorrarTodo();
    console.log("Obteniendo Elementos");
    this._loaderProvider.loaderON(); 
    this._zonaProvider.getAll().subscribe( //Obtengo todas las zonas
      response =>{                   
        
        if(response.data != undefined){
          response.data.forEach(zona  =>{ 
           
           zona.tipo = "Zona";
           zona.coordenadasPoligono = new Array();
           zona.campos = new Array(); 

           zona.nombre = zona.DS_LUGAR_ZONA;
           this.ObtenerCoordenadasZona(zona);
           this._loaderProvider.loaderOFF();
           if(localStorage.getItem('idPropiedad')=="48"){
            this._loaderProvider.loaderON();
            this._campoProvider.getByIngeniero(this.IngenieroSeleccionado.ID_ENTIDAD,this.CosechaSeleccionada.ID_COSECHA,zona.ID_LUGAR_ZONA).subscribe( //Obtengo todas las zonas
              response =>{             
                  console.log(response);
                  if (response.code == "200"){
                    if(response.data != undefined && response.data !=""){      
                      response.data.forEach(campo  =>{                     
                        this.ProcesarCampo(zona,campo);
                        this._loaderProvider.loaderOFF();            
                      })                  
                    }
                  }
          
                  if(response.code =="404"){ 
                    this._loaderProvider.loaderOFF();
                  }
                  
                },
                error=>{
                  console.log(error);
                  this._loaderProvider.loaderOFF();
                }
              )
           }

           else{
             console.log("Tienen propiedad de aparcero! no se muestran lotes de otros ingenieros")
            this._loaderProvider.loaderON();
            this._campoProvider.getByAparcero(localStorage.getItem('idEntidadLogueada'),this.CosechaSeleccionada.ID_COSECHA,zona.ID_LUGAR_ZONA).subscribe( //Obtengo todas las zonas
              response =>{             
                  console.log(response);
                  if (response.code == "200"){
                    if(response.data != undefined && response.data !=""){      
                      response.data.forEach(campo  =>{                     
                        this.ProcesarCampo(zona,campo);            
                      })                  
                    }
                  }
          
                  if(response.code =="404"){ 
                    this._loaderProvider.loaderOFF();
                  }
                  
                },
                error=>{
          
                }
              )
            }  
            this._loaderProvider.loaderOFF();
          
          });
          
        }
      },
      error=>{

      }
    )

    

    
  }

  ProcesarCampo(zona,campo){
    zona.campos.push(campo);

    //Todo lo que no traiga del servidor lo tengo que crear
    campo.tipo = "Campo";
    campo.coordenadasPoligono = new Array();
    campo.lotes = new Array();
    campo.nombre = campo.DS_CAMPO;
    campo.hectareasTotal = 0;
    campo.DS_LUGAR_ZONA = zona.DS_LUGAR_ZONA;

    this.ObtenerCoordenadasCampo(campo); 
    this.ObtenerDetalleCampo(campo);
                            
    this._loteProvider.getByCampo(campo.CD_CAMPO).subscribe( //Obtengo todas las zonas
      response =>{                   
        
        if(response.data != undefined && response.data !=""){
          
          response.data.forEach(lote  =>{ 
            
            campo.lotes.push(lote);
            
            //Todo lo que no traiga del servidor lo tengo que crear
            lote.DS_LUGAR_ZONA = zona.DS_LUGAR_ZONA;
            lote.DS_CAMPO = campo.DS_CAMPO;
            lote.tipo = "Lote";   
            lote.coordenadasPoligono = new Array(); 
            lote.nombre = lote.DS_LOTE; 
            campo.hectareasTotal += Number(lote.QT_HECTAREAS);  
            console.log(campo.hectareasTotal); 
            this.ObtenerCoordenadasLote(lote);  
            this.ObtenerUltimaRevisionLote(lote);        
            
          })

          campo.hectareasTotal = campo.hectareasTotal.toFixed(2);        
          
        }
        
      },
      error=>{
        console.log(error);
      }
    )
  }




  private ObtenerCoordenadasZona(zona:Zona){  
    
    this._coordenadaPoligonoProvider.getCoordenadasPoligonoZona(zona.ID_LUGAR_ZONA).subscribe(
      response=>{

        zona.coordenadasPoligono = new Array();
        zona.poligono = "";
        if(response.code == '200'){   

          response.data.forEach((element)=> {            
            this._mapaProvider.AgregarZonasBounds(element);
            this._mapaProvider.VisualizarZonasBounds(); 
            zona.coordenadasPoligono.push({lat: parseFloat(element.latitud),lng:  parseFloat(element.longitud)});  
          });   
          zona.contienePoligono = "si"; 
        }
        else{
          console.log("No contiene poligono");
          zona.contienePoligono = "no"; 
        }
        this.AgregarElemento(zona);
        //SetearDatosPoligonothis.SetearDatosPoligono(zona,coordenadasPoligono);      
      },
      error=>{

      }
    );
  }

  private ObtenerDetalleCampo(campo:Campo){
    this._campoProvider.getProvincia(campo.CD_PROVINCIA).subscribe(
      response=>{
        console.log(response)
        if(response.code == '200'){          
          campo.dsProvincia = response.data[0].DS_PROVINCIA;
        }

    });


    this._campoProvider.getLocalidad(campo.CD_LOCALIDAD).subscribe(
      response=>{
        console.log(response)
        if(response.code == '200'){          
          campo.dsLocalidad = response.data[0].DS_LOCALIDAD;
        }

    });
  }

  private ObtenerCoordenadasCampo(campo:Campo){  
    
    this._coordenadaPoligonoProvider.getCoordenadasPoligonoCampo(campo.CD_CAMPO).subscribe(
    response=>{

      if(response.code == '200'){          
       
        campo.coordenadasPoligono = new Array();
        campo.poligono = "";
        response.data.forEach((element)=> {
          this._mapaProvider.AgregarCampoBounds(element);
          campo.coordenadasPoligono.push({lat: parseFloat(element.latitud),lng:  parseFloat(element.longitud)});  
        }); 
        campo.contienePoligono = "si"; 
      }
      else{
        console.log(response.message);
        campo.contienePoligono = "no"; 
      }
      this.AgregarElemento(campo);
      //this.SetearDatosPoligono(campos,coordPoligono);    
    },
    error=>{

    }
  );
  }

  

  private ObtenerCoordenadasLote(lote:Lote){  
    
    this._coordenadaPoligonoProvider.getCoordenadasPoligonoLote(lote.CD_LOTE).subscribe(
    response=>{

      if(response.code == '200'){         

        lote.coordenadasPoligono = new Array();
        lote.poligono = "";
        lote.tipo = "Lote";
        response.data.forEach((element)=> {
          this._mapaProvider.AgregarLotesBounds(element);
          lote.coordenadasPoligono.push({lat: parseFloat(element.latitud),lng: parseFloat(element.longitud)});  
        });  
        lote.contienePoligono = "si"; 
      }
      else{
        console.log(response.message);
        lote.contienePoligono = "no"; 
      }
      this.AgregarElemento(lote);
      //this.SetearDatosPoligono(campo,coordPoligono);    
    },
    error=>{

    }
  );
  }

  private ObtenerUltimaRevisionLote(lote:Lote){
    this._revisionProvider.getLastByLote(lote.CD_LOTE).subscribe(
      response=>{
        if(response.data!= undefined)
          lote.ultimaRevision = response.data[0];
        console.log(lote.ultimaRevision);
        console.log(response.message);
      },
      error=>{
        console.log("Error al obtener revision del lote");
      }
    )
  }

  
}
