import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../../globals/globals';
import { GESTURE_PRIORITY_SLIDING_ITEM } from 'ionic-angular/gestures/gesture-controller';

/*
  Generated class for the UsuarioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsuarioProvider {

  public url:String;

  constructor(
	  public _http: Http
	) {
    this.url = "http://www.goldenpeanut.com.ar/login/usuarios.php";
  }

  get(id){  

		return this._http.get(this.url+'/'+id).map(res => res.json());
  }

  getAll(){ 

		return this._http.get(this.url+'/all')
						 .map(res => res.json());
	}

	getByNombre(palabra){
		return this._http.get(this.url+'/nombre/'+palabra).map(res => res.json());
	}

	put(datos){   

		let params =  "json="+JSON.stringify(datos);
	
			console.log(params);
	
			let headers = new Headers({
				'Content-Type':'application/x-www-form-urlencoded', 
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			});
	
			return this._http.post(this.url+'/', params, {headers: headers})
							 .map(res => res.json());
	  }
	
	login(nombre,contrasena){
		let params =  "nombre="+nombre+"&contrasena="+contrasena;

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/login', params, {headers: headers})
						 .map(res => res.json());
	}

	cambiarContrasena(contrasena,usuario){
		let params =  "contrasena="+contrasena+"&nombreUsuario="+usuario.nombre+"&idUsuario="+usuario.id;

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/cambiarContrasena', params, {headers: headers})
						 .map(res => res.json());
	}

	obtenerEntidadSQL(cuit,usuario){
		let params =  "cuit="+cuit+"&idUsuario="+usuario.id;

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/obtenerEntidadSQL', params, {headers: headers})
						 .map(res => res.json());
	}

	obtenerEntidadyRazonSocial(cuit,usuario){
		let params =  "cuit="+cuit+"&idUsuario="+usuario.id;

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/obtenerEntidadyRazonSocial', params, {headers: headers})
						 .map(res => res.json());
	}


	registro(mail,nombre,contrasena,confirmacionContrasena){
		let params =  "mail="+mail+"&nombre="+nombre+"&contrasena="+contrasena+"&confirmacionContrasena="+confirmacionContrasena;

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded'
		});

		return this._http.post(this.url+'/registro', params, {headers: headers})
						 .map(res => res.json());
	}

	validarToken(){
		let params =  "token="+localStorage.getItem('token');

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded'
		});

		return this._http.post(this.url+'/tokenInfo', params, {headers: headers})
						 .map(res => res.json());
	}

	asignarIngeniero(id,idEntidad){

		let params= '{"id":"'+id+'","idEntidad":"'+idEntidad+'"}';

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/registro', params, {headers: headers})
						 .map(res => res.json());
	}

  buscar(datos){   
    let params =  "json="+JSON.stringify(datos);

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/buscar', params, {headers: headers})
						 .map(res => res.json());
  }

  update(datos){
		let params = "json="+JSON.stringify(datos);
		
		console.log(params);

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/update', params, {headers: headers})
						 .map(res => res.json());
  }

  delete(datos){
    let params = "json="+JSON.stringify(datos);
		
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/delete', params, {headers: headers})
						 .map(res => res.json());
  }

  search(nombre:String){
    let params = 'nombre='+nombre;
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/buscar', params, {headers: headers})
						 .map(res => res.json());
  }

}
