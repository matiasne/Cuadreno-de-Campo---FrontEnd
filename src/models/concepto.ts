export class Concepto {   
    
    constructor(
        public ID_GRW_CONCEPTO:number, 
        public DS_GRW_CONCEPTO:String,
        public ID_GRW_SUBGRUPO:String,
        public DS_DETALLE:String,
        public QT_UTA:String,
        public VL_UTA:String,
        public LG_PRODUCTO:String,
        public LG_ANULADO:String,
        public LG_RESIEMBRA:String        
    ) { 
        
    }   
}