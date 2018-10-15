import {Http,Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { GLOBAL } from '../../globals/globals';
import { Coordenada } from '../../models/coordenada';
import { Zona } from '../../models/zona';
import { Campo } from '../../models/campo';
import { Lote } from '../../models/lote';

/*
  Generated class for the CoordenadaPoligonoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CoordenadaPoligonoProvider {

  public url:String;

  constructor(
	  public _http: Http
	) {
    this.url = GLOBAL.url+"/poligonos.php";
  }

	get(id){
		return this._http.get(this.url+'/'+id).map(res => res.json());
	}

	getAll(){ 
		return this._http.get(this.url+'/all').map(res => res.json());
	}

	getCoordenadasPoligonoZona(idZona){
		return this._http.get(this.url+'/zonas/'+idZona).map(res => res.json());   
	}
	
	getCoordenadasPoligonoCampo(idCampo){
		return this._http.get(this.url+'/campos/'+idCampo).map(res => res.json());   
	}

	getCoordenadasPoligonoLote(idLote){
		return this._http.get(this.url+'/lotes/'+idLote).map(res => res.json());   
	}
	
	
  	public put(coordenada){   

		let params =  "json="+JSON.stringify(coordenada);
		console.log(params)
		let headers = new Headers({
			'Content-Type':'application/x-www-form-urlencoded', 
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		});

		return this._http.post(this.url+'/', params, {headers: headers})
						 .map(res => res.json());
  	}

  	GuardarDibujo(elemento){
	
	
		if(elemento.tipo == "Zona")
		{
			this.deleteByZona(elemento.ID_LUGAR_ZONA).subscribe(
				response =>{
					console.log(response);
					this.guardarCoordenadas(elemento); 
				},
				error=>{
					console.log(error);
				}
			);
		}
		else if (elemento.tipo == "Campo"){
			this.deleteByCampo(elemento.CD_CAMPO).subscribe(
				response =>{
					this.guardarCoordenadas(elemento);
				},
				error=>{
					console.log(error);
				}
			);
		} else if(elemento.tipo=="Lote"){
			this.deleteByLote(elemento.CD_LOTE).subscribe(
				response =>{					
					this.guardarCoordenadas(elemento);								
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
	
	private guardarCoordenadas(elemento){
		
		if(elemento.poligono != ""){

			var vertices = elemento.poligono.getPath();
			console.log(vertices)

			if(vertices != undefined){
				
				for (var i =0; i < vertices.getLength(); i++)  //Borra las lineas dibujadas 
				{              
					var coord = new Coordenada(0,0,0,0,null,null,null,0);		

					if(elemento.tipo=="Zona")
						coord.idZona = elemento.ID_LUGAR_ZONA;
					if(elemento.tipo=="Campo")
						coord.idEstablecimiento = elemento.CD_CAMPO;
					if(elemento.tipo=="Lote")
						coord.idLote = elemento.CD_LOTE;

					coord.latitud = vertices.getAt(i).lat();
					coord.longitud = vertices.getAt(i).lng();
					coord.orden = i; //Para que independientemente del orden que se guarde siempre se dibuje bien
					
					this.put(coord).subscribe(
						response=>{
							console.log(response.message);
							
						},
						error=>{
							console.log(error);
						}
					);						
				}	
			}
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
