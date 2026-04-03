import http from "http";
import { customers, orders, products } from "./data.js";

const app = http.createServer((request, response) => {
  const url = request.url;
  const method = request.method;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  //B1: Lấy danh sách khách hàng
  if (url === "/customers" && method === "GET") {
    response.end(JSON.stringify(customers));
    return;
  }
  //B2: Lấy danh sách đơn hàng của khách hàng
  if (
    url.startsWith("/customers/") &&
    url.endsWith("/orders") &&
    method === "GET"
  ) {
    const customerId = url.split("/")[2];
    const order = orders.filter((order) => order.customerId === customerId);
    if (order.length > 0) {
      response.end(JSON.stringify(order));
    } else {
      response.end(JSON.stringify({ message: "Không tồn tại" }));
    }
    return;
  }

  //B3: Lấy thông tin khách hàng
  if (url.startsWith("/customers/") && method === "GET") {
    const customerId = url.split("/")[2];
    const customer = customers.find((customer) => customer.id === customerId);
    if (customer) {
      response.end(JSON.stringify(customer));
    } else {
      response.end(JSON.stringify({ message: "Khách hàng không tồn tại" }));
    }
    return;
  }
  //B4: Highvalue orders (tổng tiền đơn hàng > 10000000)
  if (url.startsWith("/orders/highvalueorders") && method === "GET") {
    const highvalueOrders = orders.filter(
      (order) => order.totalPrice > 10000000,
    );
    response.end(JSON.stringify(highvalueOrders));
    return;
  }

  //B5: lọc sản phẩm theo giá min và max
  //B5: lọc sản phẩm theo giá min và max
  if (url.startsWith("/products") && method === "GET") {
    const fullUrl = new URL(request.url, `http://${request.headers.host}`);
    const minPrice = fullUrl.searchParams.get("minPrice");
    const maxPrice = fullUrl.searchParams.get("maxPrice");

    // Nếu không truyền 1 trong 2 tham số, trả về toàn bộ sản phẩm
    if (!minPrice || !maxPrice) {
      response.end(JSON.stringify(products));
      return;
    }
    // Chuyển đổi sang số và lọc
    const min = Number(minPrice);
    const max = Number(maxPrice);

    const filteredProducts = products.filter(
      (product) => product.price >= min && product.price <= max,
    );

    response.end(JSON.stringify(filteredProducts));
    return;
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
