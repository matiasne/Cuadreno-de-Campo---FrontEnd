import { Revision } from "./revision";

export class Lote {

    public ultimaRevision:Revision;
    public contienePoligono:String;
    public tipo:String;

    public CD_LUGAR:number;
    public CD_CAMPO:number;
    public CD_LOTE:number;
    public DS_LOTE:String;
    public IC_ACTIVO:String;
    public CD_PRODUCTO:number;
    public CD_PRODUCTO_SUB:number;
    public QT_HECTAREAS:number;
    public DS_CULTIVO_PREVIO:String;
    public QT_KMS_AR:number;
    public QT_KMS_CH:number;
    public coordenadasPoligono:any;   
    public poligono:any;
    public hectareasProductoAplicado:number; //Utilizado en la tarea solamente

    constructor(
       
        
         
    ) { 
        this.ultimaRevision = new Revision();
      
        
    }   
}