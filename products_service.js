var productsService = function (options) {
  var seneca = this;

  var getCount = 0;
  var postCount = 0;
  var deleteCount = 0;

  seneca.add({ role: "product", cmd: "add" }, function (msg, respond) {
    console.log("> add product POST: sending response");
    this.make("product").data$(msg.data).save$(respond);

    postCount += 1;
    console.log(
      `Processed Request Count --> Get: ${getCount} Post: ${postCount} Delete: ${deleteCount}`
    );
  });

  seneca.add({ role: "product", cmd: "get" }, function (msg, respond) {
    console.log("> get-products by ID GET: sending response");
    this.make("product").load$(msg.data.product_id, respond);
    getCount = getCount + 1;
    console.log(
      `Processed Request Count --> Get: ${getCount} Post: ${postCount} Delete: ${deleteCount}`
    );
  });

  seneca.add({ role: "product", cmd: "get-all" }, function (msg, respond) {
    console.log("> get-all-products GET: sending response");
    this.make("product").list$({}, respond);
    getCount = getCount + 1;
    console.log(
      `Processed Request Count --> Get: ${getCount} Post: ${postCount} Delete: ${deleteCount}`
    );
  });

  seneca.add({ role: "product", cmd: "delete" }, function (msg, respond) {
    console.log("> delete-product by ID DELETE: sending response");
    this.make("product").remove$(msg.data.product_id, respond);

    deleteCount += 1;
    console.log(
      `Processed Request Count --> Get: ${getCount} Post: ${postCount} Delete: ${deleteCount}`
    );
  });

  seneca.add({ role: "product", cmd: "delete-all" }, function (msg, respond) {
    console.log("> delete-all-products DELETE: sending response");

    this.make("product").list$({}, function (err, list) {
      for (let i = 0; i < list.length; i++) {
        this.make("product").remove$(list[i].id, null);
      }
      respond(err, []);
    });

    deleteCount += 1;
    console.log(
      `Processed Request Count --> Get: ${getCount} Post: ${postCount} Delete: ${deleteCount}`
    );
  });
};

module.exports = productsService;
