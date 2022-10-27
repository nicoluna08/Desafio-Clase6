
const express = require("express");
const app = express();
const puerto = 8080;
const fs = require("fs");


class Contenedor{
    constructor(nombre){
this.NombreArchivo = nombre;
    }

 async save(producto){
    try {
       const productosTotal = await this.getAll();
  console.log(productosTotal);
       if (productosTotal != "EL ARCHIVO ESTA VACIO" && productosTotal !== [] ){
        const ultimoID = productosTotal[productosTotal.length-1].id+1;
        producto.id = ultimoID;
        productosTotal.push(producto);
     await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify(productosTotal,null,2));
    }else {
        producto.id = 1;
     await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify([producto],null,2));
    }
       

    } catch (error) {
        return "el producto no se puede grabar"
    }
 }

  async getAll(){
  try {
    const resultado = await fs.promises.readFile(this.NombreArchivo,"utf-8");
  if (resultado.length > 0){
    const prodJson = JSON.parse(resultado);
   
    return prodJson;    
  
  } else{
    return "EL ARCHIVO ESTA VACIO"
  }   
   
  } catch (error) {
    return "no se puede leer el archivo pedido"
  }

    }

    async getById(unID){
      try {
        const productosTotal = await this.getAll();

        const unProducto = productosTotal.find(elemnto=>elemnto.id === unID)
   if (unProducto){
    return unProducto;
    
   }else{
return "NO SE ENCUENTRA PRODUCTO"
   }
      } catch (error) {
        console.log("no se encuentra el producto");
      }
    }

    async deleteById(unID){
      try {
        const productosTotal = await this.getAll();
        const Productos = productosTotal.filter(elemnto=>elemnto.id !== unID)
        await fs.promises.writeFile(this.NombreArchivo,JSON.stringify(Productos,null,2));
    
        return `Producto ID: ${id}  fue eliminado con exito`
      } catch (error) {
        console.log("no se encuentra el producto para eliminar");
      }
    }

    async deleteAll(){
      try {
        const productosTotal = await this.getAll();
        
        await fs.promises.writeFile(this.NombreArchivo,"");
    
        return `Se Eliminaron Todos Los Productos`
      } catch (error) {
        console.log("no se puede eliminar los productos");
      }
    }
}


app.listen(puerto,()=>{
  console.log(`el servidor esta iniciado en el puerto ${puerto}`);
})

app.get("/productos",async (req,res)=>{

const  listaProductos = new  Contenedor("productos.txt");

const productosAll = await listaProductos.getAll();
res.send(productosAll );

})

app.get("/productoRandom",async (req,res)=>{

    const  listaProductos = new  Contenedor("productos.txt");

    const productosAll = await listaProductos.getAll();

    const max = productosAll.length 
    const min = 1
     numeroRandom=  Math.round(Math.random() * (max - min) + min);

     const productoPorID = await listaProductos.getById(numeroRandom);


    res.send(productoPorID);
    

})

