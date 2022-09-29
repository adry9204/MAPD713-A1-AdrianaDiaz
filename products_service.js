var productsService = function (options) {
  var seneca = this;

  seneca.add({ role: "product", cmd: "add" }, function (msg, respond) {
    console.log("> products GET: sending response");
    this.make("product").data$(msg.data).save$(respond);
  });

  seneca.add({ role: "product", cmd: "get" }, function (msg, respond) {
    console.log(`> products GET by ID: sending response ${msg.product_id}`);
    this.make("product").load$(msg.data.product_id, respond);
  });

  seneca.add({ role: "product", cmd: "get-all" }, function (msg, respond) {
    console.log("> get-all-products GET: sending response");
    this.make("product").list$({}, respond);
  });

  seneca.add({ role: "product", cmd: "delete" }, function (msg, respond) {
    this.make("product").remove$(msg.data.product_id, respond);
  });
};

module.exports = productsService;
