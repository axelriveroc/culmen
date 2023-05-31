const path = require('path'); 
const fs = require('fs'); 

const productsJSON = fs.readFileSync(path.join(__dirname , '../data/products.json') , 'utf-8');
let products = JSON.parse(productsJSON); 


const productsController = {
    index: (req, res)=>{
        res.render('products/products' , { products })
    }, 
    crearProducto: (req, res)=>{
        res.render('products/crearProductos')
    }, 
    detail: (req , res )=>{
        const elegido = products.find( p => p.id == req.params.id );
        res.render('products/productDetail' , { elegido } )
    }, 
    store: (req, res)=>{

        //const mainImage = req.files.file_img[0];
        const nuevoId = products ? products[products.length - 1].id + 1 : 1 ;
        //const image = req.files.file_img > 0 ? mainImage.filename : 'image.png';

        const image = req.files.file_img[0].filename ? req.files.file_img[0].filename : 'image.png';

        const secondaryImages = req.files.files_img;
        const onlyFilenames = secondaryImages.map( img => {
            const filename = img.filename || 'image.png';
            return { filename };
        })

        console.log(onlyFilenames)

        const newProduct = {
            id: nuevoId , 
            ...req.body , 
            imagen: image,  
            imagenes: onlyFilenames
        }

        products.push(newProduct);
        fs.writeFileSync( path.join(__dirname , '../data/products.JSON') , JSON.stringify(products, null, 2) )
        res.redirect('/products')
    }, 

    edit: (req , res)=>{

        const elegido = products.find( p => p.id == req.params.id )
        res.render('products/editarProductos' , { elegido })
    }, 

    update: (req , res)=>{
       
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == req.params.id) {
                if (req.file) {
                   fs.unlinkSync(path.join(__dirname , `../public/products/${products[i].imagen}`))
                } 
                //const image = req.files.file_img > 0 ? req.files.file_img[0].filename : 'image.png';
            const image = req.files.file_img[0].filename ? req.files.file_img[0].filename : products[i].imagen;
            const secondaryImages = req.files.files_img;

                products[i] = {
                    id: req.params.id, 
                    ...req.body, 
                    imagen: image, 
                    imagenes: secondaryImages ? secondaryImages : [{filename: 'image.png' }]
                }; 
            }
        };
        fs.writeFileSync(  path.join(__dirname , '../data/products.JSON') , JSON.stringify(products, null, 2)); 
        res.redirect('/products'); 
    }, 

    delete: (req, res)=>{

        const productsFiltrados = products.filter( p => p.id != req.params.id ); 
        const elegido = products.find( p => p.id == req.params.id );
        
         if ( elegido.imagen != 'image.png' ) {
             console.log(elegido.imagen)
            fs.unlinkSync(path.join(__dirname , `../public/products/${elegido.imagen}`))
        } 

        if ( elegido.imagenes.length > 0 ) {
            for (let i = 0; i < elegido.imagenes.length; i++) {
                fs.unlinkSync(path.join(__dirname , `../public/products/${ elegido.imagenes[i].filename }`));
            }
        }

        products = productsFiltrados; 
        fs.writeFileSync(  path.join(__dirname , '../data/products.JSON') , JSON.stringify(products , null, 2)); 
        res.redirect('/products'); 
    } 
}
module.exports = productsController; 