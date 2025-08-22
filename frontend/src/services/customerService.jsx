import axios from "axios";

class CustService {
    saveCustomer(data) {
        let token = localStorage.getItem("token");
        return axios.post("http://localhost:3000/api/customer/add", data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    viewCustomer() {
        let token = localStorage.getItem("token");
        return axios.get("http://localhost:3000/api/customer/view", {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    delCustomer(id) {
        let token = localStorage.getItem("token");
        return axios.delete(`http://localhost:3000/api/customer/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    updateCustomer(id, data) {
        let token = localStorage.getItem("token");
        return axios.put(`http://localhost:3000/api/customer/updateBy/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }

    // 🔍 Search Customer
    searchCustomer(name) {
        let token = localStorage.getItem("token");
        return axios.get(`http://localhost:3000/api/customer/search/${name}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
}

export default new CustService();
