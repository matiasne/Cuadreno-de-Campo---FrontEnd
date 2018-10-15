import { Lote } from "./lote";

export class Campo {
    
    public tipo:String;
    public contienePoligono:String;
    public hectareasTotal:number;

    public CD_LUGAR: number;
    public CD_CAMPO:number;
    public DS_CAMPO:String;
    public ID_LUGAR_ZONA: number;
    public IC_ACTIVO:String;
    public CD_PRODUCTO:number;
    public CD_PRODUCTO_SUB: String;
    public QT_KMS_PLANTA:any;
    public IC_CDA:any;
    public IC_DDA:String;        
    public DS_DOMICILIO:String;
    public DS_LOCALIDAD:String;
    public CD_CP:String;
    public CD_PROVINCIA:String;
    public CD_PARTIDO:Number;
    public CD_LOCALIDAD:number;
    public ID_INGENIERO_RESPON:number;
    public ID_COSECHA:number;
    public VL_COSTO_HA:number;
    public DT_CONTRATO:String;
    public ID_ENTIDAD:number;
    public coordenadasPoligono:any;   
    public poligono:any;
    public lotes:any;
    public dsProvincia:String;
    public dsLocalidad:String;
    //ds_domicilio viene descripto 
    
    constructor(
        
        
    ) { 
        
    }   
}