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
export class EntidadesProvider {

	public url:String;

	constructor(
		public _http: Http
	) {
		this.url = GLOBAL.url+"/entidades.php";
	}

  getAllIngenieros(){
		return this._http.get(this.url+'/ingenieros').map(res => res.json());
	}

	getAllContratistas(){
		return this._http.get(this.url+'/contratistas').map(res => res.json());
	}

	getPropiedades(id){
		return this._http.get(this.url+'/propiedades/'+id).map(res => res.json());
	}

}