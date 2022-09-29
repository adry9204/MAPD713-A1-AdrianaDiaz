console.log("Hello!");
console.log("Server listening on http://127.0.0.1:3009 ...");
console.log("Endpoints:");
console.log(
  "http://localhost:3009/product/add-product?product=iPhone&price=800&category=mobile"
);
console.log("http://localhost:3009/product/get-all-products");
console.log("http://localhost:3009/product/get-product?product_id=j8uxac");
console.log("http://localhost:3009/product/delete-product?product_id=j8uxac");
console.log("http://localhost:3009/product/delete-all-products");

var productServicePlugin = require("./products_service");
var seneca = require("seneca")();
var express = require("express");
var app = express();

seneca.add("role:api, cmd:add-product", function (args, done) {
  console.log("> products GET: received request");
  var new_product = {
    product: args.product,
    price: args.price,
    category: args.category,
  };
  console.log("--> new_product: " + JSON.stringify(new_product));
  seneca.act(
    { role: "product", cmd: "add", data: new_product },
    function (err, msg) {
      console.log(msg);
      done(err, msg);
    }
  );
});

seneca.add("role:api, cmd:get-all-products", function (args, done) {
  console.log("> get-all-products GET: received request");
  seneca.act({ role: "product", cmd: "get-all" }, function (err, msg) {
    console.log(msg);
    done(err, msg);
  });
});

seneca.add("role:api, cmd:get-product", function (args, done) {
  console.log("> get_product GET: " + args.product_id);
  seneca.act(
    { role: "product", cmd: "get", data: { product_id: args.product_id } },
    function (err, msg) {
      console.log(msg);
      done(err, msg);
    }
  );
});

seneca.add("role:api, cmd:delete-product", function (args, done) {
  console.log("> delete product with ID: " + args.product_id);
  seneca.act(
    { role: "product", cmd: "delete", data: { product_id: args.product_id } },
    function (err, msg) {
      console.log(msg);
      done(err, msg);
    }
  );
});

seneca.act("role:web", {
  use: {
    prefix: "/product",
    pin: { role: "api", cmd: "*" },
    map: {
      "add-product": { POST: true },
      "get-all-products": { GET: true },
      "get-product": { GET: true },
      "delete-product": { DELETE: true },
    },
  },
});

seneca.use(productServicePlugin);
seneca.use("seneca-entity");
app.use(require("body-parser").json());
app.use(seneca.export("web"));
app.listen(3009);
