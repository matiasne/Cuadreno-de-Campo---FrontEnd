import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../../globals/globals';
import { Coordenada } from '../../models/coordenada';
import { Zona } from '../../models/zona';
import { Campo } from '../../models/campo';
import { Lote } from '../../models/lote';
/*
  Generated class for the MarcadoresProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MarcadoresProvider {

  public url:String;

  constructor(
	  public _http: Http
	) {
    this.url = GLOBAL.url+"/marcadores.php";
  }

	get(id){
		return this._http.get(this.url+'/'+id).map(res => res.json());
	}

	getAll(){ 
		return this._http.get(this.url+'/all').map(res => res.json());
	}

	getMarcadorZona(idZona){
		return this._http.get(this.url+'/zonas/'+idZona).map(res => res.json());   
	}
	
	getMarcadorCampo(idCampo){
		return this._http.get(this.url+'/campos/'+idCampo).map(res => res.json());   
	}

	getMarcadorLote(idLote){
		return this._http.get(this.url+'/lotes/'+idLote).map(res => res.json());   
	}
	
	
  public put(marcador){   

		let params =  "json="+JSON.stringify(marcador);
		console.log(params)
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/', params, {headers: headers})
						 .map(res => res.json());
  }

  GuardarMarcador(elemento){
	
	
		if(elemento.tipo == "Zona")
		{
			this.deleteByZona(elemento.ID_LUGAR_ZONA).subscribe(
				response =>{
					console.log(response);
					this.put(elemento); 
				},
				error=>{
					console.log(error);
				}
			);
		}
		else if (elemento.tipo == "Campo"){
			this.deleteByCampo(elemento.CD_CAMPO).subscribe(
				response =>{
					this.put(elemento);
				},
				error=>{
					console.log(error);
				}
			);
		} else if(elemento.tipo=="Lote"){
			this.deleteByLote(elemento.CD_LOTE).subscribe(
				response =>{					
					this.put(elemento);								
				},
				error=>{
					console.log(error);
				}
			);
		}   
		else{
			console.log("falta definir tipo elemento!!!");
		} 
	}
	
	


	public deleteByZona(idZona){

		let params =  'json={"idZona":"'+idZona+'"}';

		console.log(params);
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/delete', params, {headers: headers})
						.map(res => res.json());
	}

	public deleteByCampo(idCampo){

		let params =  'json={"idEstablecimiento":"'+idCampo+'"}';

		console.log(params);

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/delete', params, {headers: headers})
							.map(res => res.json());
	}


  	public deleteByLote(idLote){
		let params =  'json={"idLote":"'+idLote+'"}';
		console.log(params);

		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/delete', params, {headers: headers})
						 .map(res => res.json());
	}
	
	
	
	

}
