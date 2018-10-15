import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { GLOBAL } from '../../globals/globals';

/*
  Generated class for the ProductosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductosProvider {

 
  public url:String;

  constructor(
	  public _http: Http
	) {
    this.url = GLOBAL.url+"/productos.php";
  }

  get(id){
		return this._http.get(this.url+'/'+id).map(res => res.json());
	}

	getAll(){ 
		return this._http.get(this.url+'/all').map(res => res.json());
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

		console.log(params);

		return this._http.post(this.url+'/delete', params, {headers: headers})
						 .map(res => res.json());
  }

}
