import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProductoModel } from './models/producto.model';
import { PedidoModel } from './models/pedido.model';

import pedidos from 'src/assets/json/pedido.json';
import productos from 'src/assets/json/productos.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  listaDetalle: any[] = [];
  forma: FormGroup;
  detallePedidos: FormArray;
  Pedido: any = pedidos;
  Productos: any = productos;
  // listado: PedidoModel[] = [];
  formulario = false;
  editar = false;
  fechaMax = '';
  fechaMin = '';
  buscar = '';
  page = '1';
  total = 0;
  paginas = 1;
  orden = '';
  neto = 0;
  iva = 0;
  totalvalor = 0;
  subtotal = [];
  pedido: PedidoModel = new PedidoModel();
  datoProducto: ProductoModel[] = [];
  productoslistado: ProductoModel[] = [];
  productoDatos: ProductoModel[] = [];

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router) {
      console.log(this.page, 'constructor pedidos');
      // this.listadoPedido();
      this.crearFormulario();
      this.productoPedido();
      this.editarPedido("ef1d2607-6ec0-4234-037a-08d8b1b54674");

    }

  ngOnInit(): void {
  }

  calcularTotal()
  {
    // this.extraerProducto(i);
    console.log('calcularTotal');
    this.neto = 0;
    this.forma.value.detallePedidos.forEach( linea => {
      if ( !isNaN(linea.producto.precio) && !isNaN(linea.cantidad) ) {
        console.log(linea.producto.precio);
        console.log(linea.cantidad);
        this.neto = this.neto + (linea.producto.precio * linea.cantidad);
    }
      console.log(linea.producto.precio);
      console.log(linea.cantidad);
      console.log('wow ' + this.neto);
    });
    this.iva = this.neto * 0.19;
    this.totalvalor = this.neto + this.iva;
  }

  tablaSubtotal(i: number) {
    // console.log(this.forma.value.productosForm[i].producto.precio);
    // console.log(this.forma.value.productosForm[i].cantidad);
    if (this.forma.value.detallePedidos[i].producto.precio === undefined ||
    this.forma.value.detallePedidos[i].cantidad === '')
    {
      this.subtotal[i] = 0;
      // console.log('true');
    } else {
      this.subtotal[i] = this.forma.value.detallePedidos[i].producto.precio * this.forma.value.detallePedidos[i].cantidad;
      // console.log('false');
    }
    if (this.subtotal[i] === isNaN) { this.subtotal[i] = 0; }
    // console.log('valor es: ' + this.subtotal[i]);
    return this.subtotal[i];
  }

  productoPedido() {
    console.log('productoPedido');
    this.productoslistado = this.auth.getSelector('Productos');
    console.log(this.productoslistado);
  }

  editarPedido(Id: string) {
    console.log(this.formulario);
    this.formulario = true;
    this.editar = true;
    let cont = 0;
    // this.auth.getDatoId('Pedidos', Id).subscribe( resp => {
      this.pedido = {
        ...this.Pedido,
      }
      
      console.log(this.pedido);

      this.forma.value.detallePedidos = this.pedido.detallePedidos;
      console.log(this.forma.value.detallePedidos);

      this.forma = this.fb.group({
      //   cliente: [this.pedido.cliente, [Validators.required] ],
      //   estado: [this.pedido.estado],
      //   observaciones: [this.pedido.observaciones, [Validators.required, Validators.minLength(3)] ],
        detallePedidos: this.fb.array([  ])
      });
      this.forma.value.detallePedidos = this.pedido.detallePedidos;

      this.detallePedidos = this.forma.get('detallePedidos') as FormArray;

      for (let i = 0; i < this.pedido.detallePedidos.length; i++) {
        
        this.detallePedidos.push(this.agregarEditarDetalle(this.pedido.detallePedidos[i]));
        console.log( this.forma.value.detallePedidos[i].producto);
      }

      console.log(this.forma.value.detallePedidos);
      this.calcularTotal();

   // });
  }

  agregarEditarDetalle(detalle: any): FormGroup {
    return this.fb.group({
      producto: [detalle.producto, [Validators.required] ],
      cantidad: [detalle.cantidad, [Validators.required, Validators.minLength(1), Validators.maxLength(7),Validators.min(1) , Validators.pattern('^[0-9]+$')]]
    });
  }

  // ---------------------------------------------------------------------------------

  get detallePedidosControls() {
    return this.forma.get('detallePedidos')['controls'];
  }

  getValidarCantidad(i) {

    return (<FormArray>this.forma.get('detallePedidos')).controls[i].get('cantidad').invalid &&
    (<FormArray>this.forma.get('detallePedidos')).controls[i].get('cantidad').touched;
  }

  getValidarProducto(i) {

    return (<FormArray>this.forma.get('detallePedidos')).controls[i].get('producto').invalid &&
    (<FormArray>this.forma.get('detallePedidos')).controls[i].get('producto').touched;
  }

  crearFormulario() {

    this.forma = this.fb.group({
      cliente: ['', [Validators.required] ],
      estado: [''],
      observaciones: ['', [Validators.required, Validators.minLength(3)] ],
      detallePedidos: this.fb.array([ this.createProducto()
      ])
    });
    console.log(this.forma.value);
  }


  createProducto(): FormGroup {
    return this.fb.group({
      producto: ['', [Validators.required] ],
      cantidad: [ 0, [Validators.required, Validators.minLength(1), Validators.maxLength(7),Validators.min(1) , Validators.pattern('^[0-9]+$')]]
    });
  }

  addProducto(): void {
    this.detallePedidos = this.forma.get('detallePedidos') as FormArray;
    this.detallePedidos.push(this.createProducto());
  }

  borrarProducto(i: number) {
    this.detallePedidos.removeAt(i);
    console.log(i, this.detallePedidos.value[i]);
  }

  cargarDataAlFormulario() {
    this.forma.reset({});
  }
}
