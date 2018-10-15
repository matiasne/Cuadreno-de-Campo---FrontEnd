export class RegistroVisita {    
    constructor(
        public id: number,
        public idVisita: number,
        public idProblema:number,         
        public nivel:String,
        public densidad:String,
        public nombre: String,
        public observacion:String,
        public tipo:String
    ) { }   
}