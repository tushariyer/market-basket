// Tushar Iyer
// CSCI 621 | MongoDB Project | Fall 2018

// passing startBasket allows for passing the old basket into every 'add' operation to check if the product is already
// in the basket
module.exports = function Basket(previousBasket) {
    this.items = previousBasket.items || {}; // Items in basket or empty if null
    this.qtyProducts = previousBasket.qtyProducts || 0; // Number of items in basket or zero if null
    this.totalPrice = previousBasket.totalPrice || 0; // Total price of all products in the basket or zero if null

    // Adding to basket
    this.add = function (item, id) {
        var tempItem = this.items[id]; // Store the item if its already in the basket

        // If the item isn't already in the basket
        if (!tempItem) {
            tempItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            }; // Assign both the temp and the basket to contain this new object
        }

        tempItem.qty++; // Increase quantity of items
        tempItem.price = tempItem.item.price * tempItem.qty; // Set the aggregate price for that item in particular

        this.qtyProducts++; // Increase quantity of items in basket
        this.totalPrice += tempItem.item.price; // Increase total price by the price of the added object
    };

    // Remove just one unit of a given item
    this.removeOne = function (id) {
        this.items[id].qty--; // Decrease quantity
        this.items[id].price -= this.items[id].item.price; // Update price after removal

        this.qtyProducts--; // Reduce total quantity by one
        this.totalPrice -= this.items[id].item.price; // Update total price to reflect removal

        if (this.items[id].qty <= 0){
            delete this.items[id]; // Remove it from the basket entirely
        }
    };

    // Remove all unites of a given item
    this.removeAll = function (id) {
        this.qtyProducts -= this.items[id].qty; // Reduce total quantity by number of units for that item
        this.totalPrice -= this.items[id].price; // Update total price to reflect removal

        delete this.items[id]; // Remove it from the basket entirely
    };

    // Write out the contents of the basket to an array
    this.basketToArray = function () {
        var retVals = []; // Array of values to return

        for (var id in this.items) {
            retVals.push(this.items[id]); // Load items from basket into array
        }

        return retVals; // return
    };
};