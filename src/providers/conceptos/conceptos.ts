import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../../globals/globals';
import { Campo } from '../../models/campo';

/*
  Generated class for the campoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConceptosProvider {

	public url:String;

	constructor(
		public _http: Http
	) {
		this.url = GLOBAL.url+"/conceptos.php";
	}

  get(id){
		return this._http.get(this.url+'/'+id).map(res => res.json());
	}

	getAll(){ 
		return this._http.get(this.url+'/all').map(res => res.json());
	}	

  put(campo:Campo){   
		let _campo = Object.assign({}, campo);
		
		_campo.coordenadasPoligono ="";
		_campo.poligono ="";
    let params =  "json="+JSON.stringify(_campo);

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/', params, {headers: headers})
						 .map(res => res.json());
  }

  update(campo:Campo){
		let _campo = Object.assign({}, campo);
		
		_campo.coordenadasPoligono ="";
		_campo.poligono ="";
    let params =  "json="+JSON.stringify(_campo);
		
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