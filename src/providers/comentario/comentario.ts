import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../../globals/globals';

/*
  Generated class for the ComentarioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ComentarioProvider {

  public url:String;

  constructor(
	  public _http: Http
	) {
    this.url = GLOBAL.url+"/comentarios.php";
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

  getByEstablecimiento(id){
    return this._http.get(this.url+'/establecimientos/'+id).map(res => res.json());
  }

  getByLote(id){
    return this._http.get(this.url+'/lotes/'+id).map(res => res.json());
  }

  put(comentario){   

    let params =  "json="+JSON.stringify(comentario);	
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/', params, {headers: headers})
						 .map(res => res.json());
  }

  update(comentario){
    let params =  "json="+JSON.stringify(comentario);	

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
