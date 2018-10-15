import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../../globals/globals';

/*
  Generated class for the ObservacionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ObservacionProvider {

  public url:String;

  constructor(
	  public _http: Http
	) {
    this.url = GLOBAL.url+"/observaciones.php";
  }

  get(id){
    let params = 'id='+id;
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/get', params, {headers: headers})
						 .map(res => res.json());
	}
	
	get3ByEstablecimiento(idEstablecimiento){
    let params = 'idEstablecimiento='+idEstablecimiento;
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/get/establecimiento/top3', params, {headers: headers})
						 .map(res => res.json());
	}

	get3ByLote(idLote){
    let params = 'idLote='+idLote;
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/get/lote/top3', params, {headers: headers})
						 .map(res => res.json());
  }
	
	getByEstablecimiento(idEstablecimiento){
    let params = 'idEstablecimiento='+idEstablecimiento;
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/get/establecimiento', params, {headers: headers})
						 .map(res => res.json());
	}
	
	getByLote(idLote){
    let params = 'idLote='+idLote;
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/get/lote', params, {headers: headers})
						 .map(res => res.json());
  }

  put(datos){   

    let params =  "json="+JSON.stringify(datos);

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/', params, {headers: headers})
						 .map(res => res.json());
  }

  update(datos){
    let params =  "json="+JSON.stringify(datos);

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
