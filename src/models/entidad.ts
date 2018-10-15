export class Entidad {

    //Elemento de listado!!!!
    constructor(
        public ID_ENTIDAD: number,
        public ID_ENTIDAD_TIPO: string,
        public ID_ENTIDAD_ESTADO: string,
        public DS_NOMBRE_COMERCIAL: string,
        public DS_RAZON_SOCIAL: string,
        public CD_ALTERNATIVO: string,
        public CD_CUIT: string,
        public NO_IB_INSCRIPCION: string,
        public CD_USUARIO_ALTA: string,
        public DS_OBS: string,
        public ID_COMERCIAL: string,
        public DT_ALTA: string,
        public LG_ANULADO: string,
        public ID_SUCURSAL_ALTA: string,
        public ID_SUCURSAL_MODIFICA: string,
        public DT_MODIFICA: string,
        public CD_USUARIO_MODIFICA: string,
        public VL_LIMITE_CREDITO: string,
        public DT_LIMITE_COTIZA: string,
        public VL_LIMITE_CAMBIO: string,
        public ID_LIMITE_MONEDA: string,
        public ID_LIMITE_COTIZA_FUENTE: string,
        public ID_ENTIDAD_GRUPO1: string
    ) { }   
}

