
import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import { GLOBAL } from '../../globals/globals';
import { ItemHistorial } from '../../models/itemHistorial';

/*
  Generated class for the HistorialProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HistorialProvider {

  public url:String;
  public nuevoHistorial:ItemHistorial;

  constructor(
	  public _http: Http
	) {
    this.url = GLOBAL.url+"/historial.php";
  }

  obtenerFechaFormateada(date:Date){
    
    var dd = date.getDate();
    var mm = date.getMonth()+1; //January is 0!
    var yyyy = date.getFullYear();

    return yyyy+"-"+mm+"-"+dd;
  }

  cargarNuevoElemento(idEstablecimiento,idLote,idLink,tipo,texto){


    //Consulta el elemento para sacar el idZona

    this.nuevoHistorial = new ItemHistorial(
      0,
      new Date(),
      localStorage.getItem('idUsuarioActivo'),
      localStorage.getItem('usuarioActivo'),
      tipo,
      idEstablecimiento,
      idLote,
      idLink,
      texto
    )
    
    this.put(this.nuevoHistorial).subscribe(
      response =>{
        console.log(response.message)
      },
      error=>{

      }
    );
  }


  get(id){
		return this._http.get(this.url+'/'+id).map(res => res.json());
	}

	getAll(){ 
		return this._http.get(this.url+'/all').map(res => res.json());
  }
  

  getByEstablecimiento(id){
    console.log(this.url+'/establecimientos/'+id);
    return this._http.get(this.url+'/establecimientos/'+id).map(res => res.json());
  }

  getByLote(id){
    return this._http.get(this.url+'/lotes/'+id).map(res => res.json());
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
