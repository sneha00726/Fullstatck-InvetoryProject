
import axios from 'axios';
class ProductSerivce{

    saveProduct(prodData){
        let promise=axios.post("http://localhost:3000/api/products/add",prodData);
        return promise;
    }
    getProdDetails(){
        let promise=axios.get("http://localhost:3000/api/products/view");
        return promise;
    }
    delProd(prodId){
        let promise=axios.delete(`http://localhost:3000/api/products/delete/${prodId}`);
        return promise;
    }
}
 export default new ProductSerivce();
