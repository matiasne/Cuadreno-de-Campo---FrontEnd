export class Usuario {

    public id:number;
    public nombre:string;
    public contrasena:String;
    public ID_ENTIDAD:String;
    public ID_ENTIDADSQL:String;
    public cuit:String;
    public razon_social:String;
    public mail:String;
    public codigo_activacion:String;
    public activo:String;
    public permiso:String;
    public admin:String;
    public fechaUltimaConexion:String;
    public fechaUltimoIntento:String;
    public intentos:number;
    public idPropiedad:String; //Viene en token!!!
    public idEntidad:String; //Así vienen en el token!!!!


    constructor(
        
    ) { }   
}