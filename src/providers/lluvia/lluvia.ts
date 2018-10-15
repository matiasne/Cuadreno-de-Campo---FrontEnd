import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../../globals/globals';
import { Http, Headers } from '@angular/http';

/*
  Generated class for the LluviaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LluviaProvider {

  public url:String;

  constructor(
	  public _http: Http
	) {
    this.url = GLOBAL.url+"/lluvias.php";
  }

  getFromTo(desde,hasta,idLote,idEstablecimiento){
		let params = "desde="+desde+"&hasta="+hasta+"&idLote="+idLote+"&idEstablecimiento="+idEstablecimiento;
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});
		return this._http.post(this.url+'/fromTo', params, {headers: headers})
						 .map(res => res.json());
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


}
