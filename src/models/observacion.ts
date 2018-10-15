export class Observacion {

    constructor(
        public id: number,
        public idUsuario: String,
        public nombreUsuario:String,
        public fecha:String,
        public idLote: String,
        public idEstablecimiento:String,        
        public observacion: String
    ) { }   
}