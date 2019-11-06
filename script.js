function formatCurrency(value) {
    return "$ " + value;
}

// Product Model
function ProductModel(id, name, price, category) {
    this.id = id;
    this.Name = name;
    this.Price = price;
    this.Category = category;
}

// Product View Model
function ProductViewModel(prd) {

    //Make the self as 'this' reference
    var self = this;
    //Declare observable which will be bind with UI 
    self.id = ko.observable(prd.id);
    self.Name = ko.observable(prd.Name);
    self.Price = ko.observable(prd.Price);
    self.Category = ko.observable(prd.Category);

    var Product = new ProductModel(self.id, self.Name, self.Price, self.Category);

    self.Product = ko.observable();
    self.Products = ko.observableArray(); // Contains the list of products

    // Initialize the view-model
    $.ajax({
        url: 'http://localhost:3000/Products',
        cache: false,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        data: {},
        success: function (data) {
            self.Products(data); //Put the response in ObservableArray
        }
    });

    // Calculate Total of Price After Initialization
    self.Total = ko.computed(function () {
        var sum = 0;
        var arr = self.Products();
        for (var i = 0; i < arr.length; i++) {
            sum += arr[i].Price;
        }
        return sum;
    });

    //Add New Item
    self.create = function () {
        if (Product.Name() != "" && Product.Price() != "" && Product.Category() != "") {
            Product.Price = Number.parseInt(Product.Price());
            $.ajax({
                url: 'http://localhost:3000/Products',
                cache: false,
                type: 'POST',
                contentType: 'application/json; charset=utf-8',
                data: ko.toJSON(Product),
                success: function (data) {
                    self.Products.push(data);
                    self.reset();
                    alert('Product added successfully!');
                }
            }).fail(
                function (xhr, textStatus, err) {
                    alert(err);
                });

        }
        else {
            alert('Please Enter All the Values !!');
        }

    }
    // Delete product details
    self.delete = function (Product) {
        if (confirm('Are you sure to Delete "' + Product.Name + '" product ??')) {
            var id = Product.id;
            $.ajax({
                url: 'http://localhost:3000/Products/' + id,
                cache: false,
                type: 'DELETE',
                contentType: 'application/json; charset=utf-8',
                data: {},
                success: function (data) {
                    self.Products.remove(Product);

                }
            }).fail(
                function (xhr, textStatus, err) {
                    alert(err);
                });
        }
    }

    // Edit product details
    self.edit = function (Product) {
        self.Product(Product);
    }

    // Update product details
    self.update = function () {
        self.Product().Price = Number.parseInt(self.Product().Price);
        let Product = self.Product();
        let id = Product.id;

        $.ajax({
            url: 'http://localhost:3000/Products/' + id,
            cache: false,
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            data: ko.toJSON(Product),
            success: function (data) {
                self.Products.replace(Product, data);
                self.cancel();
                alert("Record Updated Successfully");
            }
        })
            .fail(
                function (xhr, textStatus, err) {
                    alert(err);
                });
    }

    // Reset product details
    self.reset = function () {
        self.Name("");
        self.Price("");
        self.Category("");
    }

    // Cancel product details
    self.cancel = function () {
        self.Product(null);
    }
}

var prd = new ProductModel(null, "", "", "");
var viewModel = new ProductViewModel(prd);
window.onload = function () {
    ko.applyBindings(viewModel);
}
