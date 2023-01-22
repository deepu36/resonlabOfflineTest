const { v4: uuidv4 } = require('uuid');

class ToppingChef {
    constructor() {
        this.prepareTime = 4;
        this.toppingsPerPizza = 2;
    }

    addToppings(order) {
        console.log(`${new Date().toISOString()} - Adding toppings for order ${order.id}`);
        let start = new Date().getTime();
        setTimeout(() => {
            order.prepTime += this.prepareTime * (order.toppings.length / this.toppingsPerPizza);
            console.log(`${new Date().toISOString()} - Toppings for order ${order.id} are ready`);
            order.toppings = [];
            order.next();
        }, (this.prepareTime * order.toppings.length / this.toppingsPerPizza) * 1000);
    }
}

class DoughChef {
    constructor() {
        this.prepareTime = 7;
    }

    prepareDough(order) {
        console.log(`${new Date().toISOString()} - Preparing dough for order ${order.id}`);
        let start = new Date().getTime();
        setTimeout(() => {
            order.prepTime += this.prepareTime;
            console.log(`${new Date().toISOString()} - Dough for order ${order.id} is ready`);
            order.next();
        }, this.prepareTime * 1000);
    }
}

class Oven {
    constructor() {
        this.cookTime = 10;
    }

    cookPizza(order) {
        console.log(`${new Date().toISOString()} - Cooking pizza for order ${order.id}`);
        let start = new Date().getTime();
        setTimeout(() => {
            order.prepTime += this.cookTime;
            console.log(`${new Date().toISOString()} - Pizza for order ${order.id} is ready`);
            order.cooked = true;
            order.next();
        }, this.cookTime * 1000);
    }
}

class Serving {
    constructor() {
        this.servingTime = 5;
    }

    servePizza(order) {
        console.log(`${new Date().toISOString()} - Serving pizza for order ${order.id}`);
        let start = new Date().getTime();
        setTimeout(() => {
            order.prepTime += this.servingTime;
            console.log(`${new Date().toISOString()} - Pizza for order ${order.id} has been served`);
            order.served = true;
            order.next();
        }, this.servingTime * 1000);
    }
}

class Order {
    constructor(id, doughChef, toppingChef, oven, serving, toppings) {
        this.id = id;
        this.doughChef = doughChef;
        this.toppingChef = toppingChef;
        this.oven = oven;
        this.serving = serving;
        this.toppings = toppings;
        this.prepTime = 0;
    }

    next() {
        if (this.toppings.length > 0) {
            this.toppingChef.addToppings(this);
        } else if (!this.cooked) {
            this.oven.cookPizza(this);
        } else if (!this.served) {
            this.serving.servePizza(this);
        }
    }
}

const a = new Order(uuidv4(), new DoughChef(), new ToppingChef(), new Oven(), new Serving(), ['tomoto', 'panner']).next();
