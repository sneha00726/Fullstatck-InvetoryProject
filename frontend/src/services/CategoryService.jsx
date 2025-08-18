
import axios from 'axios';
class CategoryService{

    saveCategory(catdata){
        let promise=axios.post("http://localhost:3000/api/categories/add",catdata);
        return promise;
    }
     getCategory(){
        let promise=axios.get("http://localhost:3000/api/categories/view");
        return promise;
    }
    delCat(catId){
        let promise=axios.delete(`http://localhost:3000/api/category/delete/${catId}`);
        return promise;
    }
    
}
 export default new CategoryService();
