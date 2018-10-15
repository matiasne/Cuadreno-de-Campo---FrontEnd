import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../../globals/globals';
import { Lote } from '../../models/lote';

/*
  Generated class for the LoteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoteProvider {

  public url:String;

	constructor(
		public _http: Http
		) {
		this.url = GLOBAL.url+"/lotes.php";
	}

  	get(id){
		return this._http.get(this.url+'/'+id).map(res => res.json());
	}

	getAll(){ 
		return this._http.get(this.url+'/all').map(res => res.json());
	}

	getByCampo(idCampo){
		return this._http.get(this.url+'/campos/'+idCampo).map(res => res.json());
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

	getLastCampana(idEstablecimiento){

		let params = 'idEstablecimiento='+idEstablecimiento;
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/get/establecimiento/ultimaCampana', params, {headers: headers})
						.map(res => res.json());
	}

	getByCampana(idEstablecimiento,idCampana){
		
		let params = 'idEstablecimiento='+idEstablecimiento+'&idCampana='+idCampana;
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});
 
		return this._http.post(this.url+'/get/establecimiento/campana', params, {headers: headers})
						.map(res => res.json());
	}

	

	put(lote:Lote){      
		let _lote = Object.assign({}, lote);
		
		_lote.coordenadasPoligono ="";
		_lote.poligono ="";
    let params =  "json="+JSON.stringify(_lote);
		
		console.log(params);

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/', params, {headers: headers})
						.map(res => res.json());
	}

	update(lote:Lote){
		let _lote = Object.assign({}, lote);
		
		_lote.coordenadasPoligono ="";
		_lote.poligono ="";
    	let params =  "json="+JSON.stringify(_lote);
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
