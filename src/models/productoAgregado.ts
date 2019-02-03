export class ProductoAgregado {
    //Elemento de listado!!!!
    constructor(
        public CD_GRW_PRODUCTO:number,
        public DS_GRW_PRODUCTO:String,
        public dosis:number, 
        public totalAgregar:number, //Esto solo es utilizado al momento de agregar un producto
        public unidad:String
    ) { }   
}