import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../../globals/globals';
import { RegistroVisita } from '../../models/registroVisita';
import { Visita } from '../../models/visita';

@Injectable()
export class VisitaProvider {

  public url:String;

  constructor(
	  public _http: Http
	) {
    this.url = GLOBAL.url+"/visitas.php";
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

	getByEstablecimiento(idEstablecimiento){
		return this._http.get(this.url+'/establecimiento/'+idEstablecimiento).map(res => res.json());
	}


	getRegistros(idVisita){
		return this._http.get(this.url+'/'+idVisita+'/registros').map(res => res.json());
	}

	getLotesAfectados(idVisita){
		return this._http.get(this.url+'/'+idVisita+'/lotesAfectados').map(res => res.json());
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
		
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/update', params, {headers: headers})
						 .map(res => res.json());
  }

  delete(datos){
    
    let params =  "json="+JSON.stringify(datos);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/delete', params, {headers: headers})
						 .map(res => res.json());
	}

	
	
	//---------------------------------
	//Registros
	//---------------------------------

	putRegistro(datos:RegistroVisita){   

    let params =  "json="+JSON.stringify(datos);
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(GLOBAL.url+"/visitasRegistros.php/", params, {headers: headers})
						 .map(res => res.json());
	}

	deleteRegistro(datos:RegistroVisita){
		let params =  "json="+JSON.stringify(datos);
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(GLOBAL.url+"/visitasRegistros.php/delete", params, {headers: headers})
						 .map(res => res.json());
	}

	deleteRegistrosFromVisita(visita:Visita){

		let params =  'json={"idVisita":"'+visita.id+'"}';
		
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(GLOBAL.url+"/visitasRegistros.php/delete", params, {headers: headers})
						 .map(res => res.json());

	}

	//--------------------------------------
	//Lotes Afectados
	//----------------------------------------

	putLoteAfectado(idVisita,idLote){   

		let params =  'json={"idVisita":"'+idVisita+'","idLote":"'+idLote+'"}';
		
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(GLOBAL.url+"/visitasLotesAfectados.php/", params, {headers: headers})
						 .map(res => res.json());
	}

	deleteLoteAfectado(idLote){
		
		let params =  'json={"idLote":"'+idLote+'"}';
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(GLOBAL.url+"/visitasLotesAfectados.php/delete", params, {headers: headers})
						 .map(res => res.json());
	}

	deleteLotesAfectadosFromVisita(visita:Visita){

		let params =  'json={"idVisita":"'+visita.id+'"}';
		
		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(GLOBAL.url+"/visitasLotesAfectados.php/delete", params, {headers: headers})
						 .map(res => res.json());

	}
	

	
	
	


	
	

}
