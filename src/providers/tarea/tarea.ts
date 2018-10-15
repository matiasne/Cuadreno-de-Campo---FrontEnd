import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../../globals/globals';
import { Tarea } from '../../models/tarea';

/*
  Generated class for the TareaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TareaProvider {

  public url:String;

  constructor(
	  public _http: Http
	) {
    this.url = GLOBAL.url+"/tareas.php";
  }

  get(id){  
		return this._http.get(this.url+'/'+id).map(res => res.json());
	}

	getAll(){
		return this._http.get(this.url+'/all').map(res => res.json());
	} 

	getBylote(idLote){
		return this._http.get(this.url+'/lotes/'+idLote).map(res => res.json());
	}
	
	getLotesAfectados(idTarea){
		return this._http.get(this.url+'/'+idTarea+'/lotesAfectados').map(res => res.json());
	}

	getByVisita(idVisita){
		return this._http.get(this.url+'/all/visita/'+idVisita+'').map(res => res.json());
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

		return this._http.post(this.url+'/delete', params, {headers: headers})
						 .map(res => res.json());
	}
	


	
	//--------------------------------------
	//Lotes Afectados
	//----------------------------------------

	putLoteAfectado(idTarea,idLote,hectareasAplicado){   

		let params =  'json={"idTarea":"'+idTarea+'","idLote":"'+idLote+'","hectareasAplicado":"'+hectareasAplicado+'"}';
		
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(GLOBAL.url+"/tareasLotesAfectados.php/", params, {headers: headers})
						 .map(res => res.json());
	}

	deleteLoteAfectado(idLote){
		
		let params =  'json={"idLote":"'+idLote+'"}';
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(GLOBAL.url+"/tareasLotesAfectados.php/delete", params, {headers: headers})
						 .map(res => res.json());
	}

	deleteLotesAfectadosFromVisita(tarea:Tarea){

		let params =  'json={"idTarea":"'+tarea.id+'"}';
		
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(GLOBAL.url+"/tareasLotesAfectados.php/delete", params, {headers: headers})
						 .map(res => res.json());

	}

}
