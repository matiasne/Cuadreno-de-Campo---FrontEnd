export class Coordenada {

    constructor(
        public id: number,
        public idEstablecimiento:number,
        public idLote:number,
        public idZona:number,
        public latitud: string,
        public longitud:string,
        public zoom:string,  
        public orden:number   
    ) { }   
}