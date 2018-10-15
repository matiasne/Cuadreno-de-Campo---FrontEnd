import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../../globals/globals';
import { Zona } from '../../models/zona';

@Injectable()
export class ZonaProvider {

  public url:String;

	constructor(
		public _http:Http
	) {
		this.url = GLOBAL.url+"/zonas.php";
  }
  
  get(id){
		return this._http.get(this.url+'/'+id).map(res => res.json());
	}

	getAll(){ 
		return this._http.get(this.url+'/all').map(res => res.json());
	}

  getByProductor(idUsuario){
    let params = 'idUsuario='+idUsuario;
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/get/productor', params, {headers: headers})
						 .map(res => res.json());
  }

  put(zona:Zona){   
		let _zona = Object.assign({}, zona);
		
		_zona.coordenadasPoligono ="";
		_zona.poligono ="";
    let params =  "json="+JSON.stringify(_zona);

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/', params, {headers: headers})
						 .map(res => res.json());
  }

  update(zona:Zona){
		let _zona = Object.assign({}, zona);
		
		_zona.coordenadasPoligono ="";
		_zona.poligono ="";
    let params =  "json="+JSON.stringify(_zona);
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/update', params, {headers: headers})
						 .map(res => res.json());
  }

  delete(id){
    let params = 'id='+id;
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/delete', params, {headers: headers})
						 .map(res => res.json());
  }

}
