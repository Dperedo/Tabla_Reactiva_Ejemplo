import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import pedido from 'src/assets/json/pedido.json';
import productos from 'src/assets/json/productos.json';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private url = 'https://localhost:5001/api';


    userToken = '';
    page = '';
    buscar = '';
    Pedido: any = pedido;
    Productos: any = productos;

  constructor( private http: HttpClient,
               private router: ActivatedRoute ) { }

  getSelector(controlador: string){
    
    console.log('Dentro de getEstado');
    // return this.http.get(`${ this.url }/${ controlador }`).pipe(map((res: any) => res));
    return this.Productos;
  }

  getDato(controlador: string, buscar: string, page: string, orden: string) {
    
    console.log('Dentro de getDatoBuscar');

    
    console.log('page=' + page, 'buscar=' + buscar, 'orden=' + orden);
    
    return this.Productos;
    //return this.http.get(`${ this.url }/${ controlador }/query?texto=${ buscar }&page=${ page }&order=${ orden }`).pipe(map((res: any) => res ));
  }

  getDatoId(controlador: string, ID: string) {
    
    console.log('ID=' + ID);
    console.log('Dentro de getDatoId');
    
    return this.Pedido;
    // return this.http.get(`${ this.url }/${ controlador }/${ ID }`).pipe(map((res: any) => res ));
  }
}