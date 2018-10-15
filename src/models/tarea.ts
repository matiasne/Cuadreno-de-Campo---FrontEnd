export class Tarea {

    constructor(
        public id: number,
        public fecha:String,
        public idEstablecimiento:number,
        public idVisitia:number,
        public idUsuario: String,
        public nombreUsuario:String,
        public idConcepto:number,
        public dsConcepto:String,
        public idProducto:number,
        public idEntidad:number,
        public dsEntidad:String,
        public dosis:number,
        public hectareas:number,        
        public accion:String,
        public observacion:String,
        public idVisita:number,
        public estado:String
    ) { }   
}