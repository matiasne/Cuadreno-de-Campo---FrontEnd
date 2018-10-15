import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, ViewController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { EventoClimatico } from '../../models/eventoClimatico';
import { LluviaProvider } from '../../providers/lluvia/lluvia';
import { Lluvia } from '../../models/lluvia';
import { GlobalesProvider } from '../../providers/globales/globales';
import { ClimaDia } from '../../models/climaDia';
/**
 * Generated class for the ClimaticoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-climatico',
  templateUrl: 'climatico.html',
})
export class ClimaticoPage {

  lineChart: any;
  public eventosClimaticos:EventoClimatico[];
  
  public densidadGranizo:String;
  public tipoEvento:String;
  
  public arrayMeses:any;
  public fechaDesde:String;
  public fechaHasta:String;
  public lluvias:Lluvia[];
  public lluviaSeteada:Lluvia;
  public climaDiasElementoSeleccionado:ClimaDia[];

  @ViewChild('lineCanvas') lineCanvas;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public _lluviaProvider:LluviaProvider,
    public _globalesProvider:GlobalesProvider) {
    this.lluviaSeteada = new Lluvia(0,0,0,0,"");
    this.climaDiasElementoSeleccionado = new Array;
  }

  ionViewDidLoad() {

    this.fechaDesde = this.obtenerFechaMesAnterior(new Date());
    this.fechaHasta = this.obtenerFechaFormateada(new Date());

    this.lluviaSeteada.fecha = this.obtenerFechaFormateada(new Date());
    
    console.log('ionViewDidLoad ClimaticoPage');

    

    if(this._globalesProvider.elementoSeleccionado.tipo == "Lote"){
      this.lluviaSeteada.idLote = this._globalesProvider.elementoSeleccionado.id
      this.lluviaSeteada.idEstablecimiento = this._globalesProvider.elementoSeleccionado.idEstablecimiento;
    }

    if(this._globalesProvider.elementoSeleccionado.tipo == "Campo"){
      this.lluviaSeteada.idLote = 0;
      this.lluviaSeteada.idEstablecimiento = this._globalesProvider.elementoSeleccionado.id;
    } 
    
    this.ObtenerLluvias();

  }

  InicilizarGráfico(){
    var dataFirst = {
      label: "Lluvias en mm",      
      lineTension: 0.3,
      fill: false,
      borderColor: 'red',
      backgroundColor: 'transparent',
      pointBorderColor: 'red',
      pointBackgroundColor: 'lightgreen',
      pointRadius: 5,
      pointHoverRadius: 15,
      pointHitRadius: 30,
      pointBorderWidth: 2,
      pointStyle: 'rect'
    };


    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
 
      type: 'line',
      data: {
          
        datasets: [dataFirst],
        options: {
          title: {
            display: true,
            text: 'Lluvias en mm'
          },
          legend: { display: true }
        }
      }
    });
  }

  MostrarFormulario(eventoClimatico){
    console.log(eventoClimatico);
    this.tipoEvento = eventoClimatico;
  }

  GuardarGranizo(){

  }

  GuardarLluvia(){
    
    this._lluviaProvider.put(this.lluviaSeteada).subscribe(
      response=>{
        console.log(response.message);
        this.lluvias = response.data; 
        this.ObtenerLluvias();      
      },
      error=>{
        console.log(error);
      }
    )

  }

 

  Cancelar(){
    this.dismiss();
  }
   
  dismiss() {
    
    this.viewCtrl.dismiss();
  }

  private pad2(number) {   
    return (number < 10 ? '0' : '') + number  
  }


  obtenerFechaFormateada(date:Date){    
    var dd = this.pad2(date.getDate());
    var mm = this.pad2(date.getMonth()+1); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy+"-"+mm+"-"+dd;
  }
  obtenerFechaMesAnterior(date:Date){    
    var dd = this.pad2(date.getDate());
    var mm = this.pad2(date.getMonth()); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy+"-"+mm+"-"+dd;
  }


  ObtenerLluvias(){

    this._lluviaProvider.getFromTo(this.fechaDesde,this.fechaHasta,this.lluviaSeteada.idLote,this.lluviaSeteada.idEstablecimiento).subscribe(
      response=>{
        console.log(response.message);
        this.lluvias = response.data;  
        
        this.climaDiasElementoSeleccionado =[];

        if(this.lluvias != undefined){
          this.lluvias.forEach(lluvia =>{ 
           this.ProcesarPorDia(lluvia);   
          
          })
        }

        this.GraficarDias();
        
      },
      error=>{
        console.log(error);
      }
    )

  }

  GraficarDias(){

    this.InicilizarGráfico();

    this.climaDiasElementoSeleccionado.forEach(dia =>{
      
      var date = new Date(dia.fecha['date']);
      var stringDate = date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear();
      console.log(stringDate);

      this.lineChart.data.labels.push(stringDate);
      this.lineChart.data.datasets.forEach((dataset) => {
          dataset.data.push(dia.totalPrecipitaciones);
      });
    
    })
    this.lineChart.update();
  }

  ProcesarPorDia(lluvia:Lluvia){

    //Busco si ya hay un día cargado con algún parámetro
    if(this.climaDiasElementoSeleccionado != undefined){ 
      var clima = this.climaDiasElementoSeleccionado.find(
        dia => dia.fecha['date'] === lluvia.fecha['date']
      )
    }  

    //Si encuentra entonces suma el valor de precipitaciones
    if(clima != undefined){
      clima.totalPrecipitaciones += lluvia.valor;
    }
    else{ //Si no lo crea y le asigna las precipitaciones
      var nuevoDia = new ClimaDia(0,lluvia.fecha,lluvia.valor);
      this.climaDiasElementoSeleccionado.push(nuevoDia);
    }
  }

}
