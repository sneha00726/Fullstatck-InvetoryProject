let db = require("../../db.js");

exports.dashmodel=()=>
{
    return new Promise((resolve,reject)=>
    {
        let query = `
            SELECT COUNT(*) AS totalProducts FROM product;
            SELECT COUNT(*) AS totalSales FROM sales;
            SELECT COUNT(*) AS totalPurchases FROM purchase;
        `;
      db.query(query, (err, result) => {
            if (err) {
                reject(err);
            } else {
                // MySQL returns an array of result sets
                let data = {
                    products: result[0][0].totalProducts,
                    sales: result[1][0].totalSales,
                    purchases: result[2][0].totalPurchases
                };
                resolve(data);
            }
        });
    });
}