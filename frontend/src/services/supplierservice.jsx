import axios from "axios";

class SupplierService{
    saveSupplier(data){
        let promise=axios.post("http://localhost:3000/api/suppliers/add",data);
        return promise;

    }
    getSupplier(){
        let promise=axios.get("http://localhost:3000/api/suppliers/view");
        return promise;

    }
}
export default new SupplierService();
