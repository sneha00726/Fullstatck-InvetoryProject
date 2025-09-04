import React, { useEffect, useState } from "react";
import { getDashboardData } from "./DashboardService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./dashboard.css";

const DashboardPage = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [productsPerCategory, setProductsPerCategory] = useState([]);
  const [salesThisMonth, setSalesThisMonth] = useState(0);
  const [monthlySales, setMonthlySales] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const data = await getDashboardData();
      setTotalProducts(data.totalProducts);
      setTotalCategories(data.totalCategories);
      setProductsPerCategory(data.productsPerCategory);
      setSalesThisMonth(data.salesThisMonth);
      setMonthlySales(data.monthlySales);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EFF", "#FF5C5C"];

  return (
    <div className="container p-4">
      <h2 className="mb-4">Dashboard</h2>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 card-summary bg-primary text-white">
          <h5>Total Products</h5>
          <h3>{totalProducts}</h3>
        </div>
        <div className="col-md-3 card-summary bg-success text-white">
          <h5>Total Categories</h5>
          <h3>{totalCategories}</h3>
        </div>
        <div className="col-md-3 card-summary bg-warning text-white">
          <h5>Sales This Month</h5>
          <h3>₹{salesThisMonth}</h3>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-4">
        <div className="col-md-6">
          <h5>Products Per Category</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productsPerCategory}
                dataKey="productCount"
                nameKey="cname"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {productsPerCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6">
          <h5>Monthly Sales</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySales}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalSales" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Products per Category Table */}
      <h4>Products Per Category Table</h4>
      <table className="table table-striped text-center">
        <thead className="table-dark">
          <tr>
            <th>Category</th>
            <th>Number of Products</th>
          </tr>
        </thead>
        <tbody>
          {productsPerCategory.map((item, index) => (
            <tr key={index}>
              <td>{item.cname}</td>
              <td>{item.productCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardPage;
