export class Comentario {

    constructor(
        public id: number,
        public idUsuario: String,
        public idLote: number,
        public idEstablecimiento:number,
        public nombreUsuario:String,
        public fecha:String,
        public comentario: String
    ) { }   
}