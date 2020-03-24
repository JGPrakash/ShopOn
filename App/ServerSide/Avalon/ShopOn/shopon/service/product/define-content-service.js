function DefineContentService() {
    this.getPOCData= function() {
        return {
            status:"Approved",
            productName:"Billy",
            designerName:"Filip",
            referenceMeasure:"2inch * 5inch"
        };

    };
    
    this.getCategory = function() {
        return [
            { category: "Starter" },
            { category: "Biryani" },
            { category: "Breads" },
            { category: "Chineese" },
            { category: "Tandoor" }
        ];

    };

    this.getItems = function () {
        return [
            { category: "Starter", itemName: "aaaaaa", itemDescription: "aaaaaaaaaaaaaaaaaaaaa", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Starter", itemName: "bbbbbb", itemDescription: "bbbbbbbbbbbbbbbbbbbbb", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Starter", itemName: "cccccc", itemDescription: "ccccccccccccccccccccc", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Starter", itemName: "dddddd", itemDescription: "ddddddddddddddddddddd", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Starter", itemName: "eeeeee", itemDescription: "eeeeeeeeeeeeeeeeeeeee", itemPrice: "200", itemImage: "aa.jpg" },

            { category: "Biryani", itemName: "aaaaaa", itemDescription: "aaaaaaaaaaaaaaaaaaaaa", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Biryani", itemName: "bbbbbb", itemDescription: "bbbbbbbbbbbbbbbbbbbbb", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Biryani", itemName: "cccccc", itemDescription: "ccccccccccccccccccccc", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Biryani", itemName: "dddddd", itemDescription: "ddddddddddddddddddddd", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Biryani", itemName: "eeeeee", itemDescription: "eeeeeeeeeeeeeeeeeeeee", itemPrice: "200", itemImage: "aa.jpg" },

              { category: "Breads", itemName: "aaaaaa", itemDescription: "aaaaaaaaaaaaaaaaaaaaa", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Breads", itemName: "bbbbbb", itemDescription: "bbbbbbbbbbbbbbbbbbbbb", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Breads", itemName: "cccccc", itemDescription: "ccccccccccccccccccccc", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Breads", itemName: "dddddd", itemDescription: "ddddddddddddddddddddd", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Breads", itemName: "eeeeee", itemDescription: "eeeeeeeeeeeeeeeeeeeee", itemPrice: "200", itemImage: "aa.jpg" },

              { category: "Chineese", itemName: "aaaaaa", itemDescription: "aaaaaaaaaaaaaaaaaaaaa", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Chineese", itemName: "bbbbbb", itemDescription: "bbbbbbbbbbbbbbbbbbbbb", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Chineese", itemName: "cccccc", itemDescription: "ccccccccccccccccccccc", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Chineese", itemName: "dddddd", itemDescription: "ddddddddddddddddddddd", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Chineese", itemName: "eeeeee", itemDescription: "eeeeeeeeeeeeeeeeeeeee", itemPrice: "200", itemImage: "aa.jpg" },

              { category: "Tandoor", itemName: "aaaaaa", itemDescription: "aaaaaaaaaaaaaaaaaaaaa", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Tandoor", itemName: "bbbbbb", itemDescription: "bbbbbbbbbbbbbbbbbbbbb", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Tandoor", itemName: "cccccc", itemDescription: "ccccccccccccccccccccc", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Tandoor", itemName: "dddddd", itemDescription: "ddddddddddddddddddddd", itemPrice: "200", itemImage: "aa.jpg" },
            { category: "Tandoor", itemName: "eeeeee", itemDescription: "eeeeeeeeeeeeeeeeeeeee", itemPrice: "200", itemImage: "aa.jpg" }
        ];

    };


}