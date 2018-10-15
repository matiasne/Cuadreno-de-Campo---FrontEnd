export class ItemHistorial {

    constructor(
        public id: number,
        public fecha:Date,
        public idUsuario: String,
        public nombreUsuario:String,
        public tipo: number,
        public idEstablecimiento:number,
        public idLote: number,
        public idLink: number,   
        public texto:String     
    ) { }   
}