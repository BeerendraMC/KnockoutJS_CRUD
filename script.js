function formatCurrency(value) {
    return "$ " + value;
}

function ProductViewModel() {

    //Make the self as 'this' reference
    var self = this;
    //Declare observable which will be bind with UI 
    self.id = ko.observable("");
    self.Name = ko.observable("");
    self.Price = ko.observable("");
    self.Category = ko.observable("");

    var Product = {
        id: self.id,
        Name: self.Name,
        Price: self.Price,
        Category: self.Category
    };

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
                    self.Name("");
                    self.Price("");
                    self.Category("");
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
        var Product = self.Product();
        var id = Product.id;

        $.ajax({
            url: 'http://localhost:3000/Products/' + id,
            cache: false,
            type: 'PUT',
            contentType: 'application/json; charset=utf-8',
            data: ko.toJSON(Product),
            success: function (data) {
                self.Products.replace(Product,data);
                self.Product(null);
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
var viewModel = new ProductViewModel();
window.onload = function () {
    ko.applyBindings(viewModel);
}
