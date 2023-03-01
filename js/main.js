// In the first few sections, we do all the coding here.
// Later, you'll see how to organize your code into separate
// files and modules.

var Vehicle = Backbone.Model.extend({
    idAttribute: 'registrationNumber',
    urlRoot: '/api/vehicles',
    start: function () {
        console.log('Vehicle started');
    },
    validate: function (att) {
        if (!att?.registrationNumber) {
            return 'registrationNumber is required fool!!';
        }
    }
});

//Derive Backbone model from the Vehicle and call it Car

var Car = Vehicle.extend({
    start: function () {
        console.log('Car with registration number' + this.get('registrationNumber') + ' started.');

    }
});

var car = new Car({
    registrationNumber: 'XLI887',
    color: 'Blue'
});

//car.start();
//Remove registrationNumber
car.unset('registrationNumber');

if (!car?.isValid()) {
    console.log(car.validationError);
}

car.set('registrationNumber', 'XLI887');

if (!car?.isValid()) {
    console.log(car.validationError);
}

car?.start();

//Collections exercice:

var Vehicles = Backbone.Collection.extend({
    model: Vehicle
});

var vehicles = new Vehicles();

vehicles.add(new Car({registrationNumber: 'XLI887', color: 'Blue'}));
vehicles.add(new Car({registrationNumber: 'ZNP123', color: 'Blue'}));
vehicles.add(new Car({registrationNumber: 'XUV456', color: 'Gray'}));

console.log(vehicles);

//Find all the blue cars and log them in the console

var allBlueCars = vehicles.where({color: 'Blue'});//return an array
console.log(allBlueCars);

//Find a car with a registration number

var carR = vehicles.findWhere({registrationNumber: 'XLI887'});//return an instance
console.log(carR);

vehicles.remove(carR);
var carsToJson = vehicles.toJSON();
console.log('cars to json', carsToJson);

vehicles.each(function (car) {
    console.log(car)
});

//Backbone views

var VehicleView = Backbone.View.extend({
    tagName: 'li',
    className: 'vehicle',

    events: {
        'click.delete': 'onDelete'
    },
    onDelete: function () {
        this.remove();
    },
    render: function () {
        // this.$el.html(this.model.get('registrationNumber')+ ' <Button type="button">Delete</Button>');
        // this.$el.attr('id',this.model.id);
        // return this;
        var template = _.template($("#vehicleTemplate").html());
        var htmlTemplate = template(this.model.toJSON());
        this.$el.html(htmlTemplate);
        this.$el.attr('data-color',this.model.get('color'));

        return this;

    }
});

// var vehicleView = new VehicleView({el:'#container', model:car});
// vehicleView.render();

var VehiclesView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function () {
        this.collection.on("add", this.addVehicle, this);
        this.collection.remove("remove", this.removedVehicle, this);
    },
    addVehicle: function (car) {
        var vehicleView = new VehicleView({model: car});
        this.$el.append(vehicleView.render()?.$el);
    },
    removedVehicle: function (car) {
        this.$("li#" + car.registrationNumber).remove();
    },
    render: function () {
        var self = this;
        this.collection.each(function (car) {
            var vehicleView = new VehicleView({model: car});
            self.$el.append(vehicleView.render()?.$el);
        });
        return this;
    }
});

var vehiclesView = new VehiclesView({collection: vehicles});
$('#container').html(vehiclesView.render().$el);