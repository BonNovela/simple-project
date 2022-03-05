class Product {
    constructor(name, price, year) {
        this.name = name;
        this.price = price;
        this.year = year;
    }
}

class UI {
    addProduct(product) {
        const productList = document.getElementById("product-list")
        const element = document.createElement("div");
   
        element.innerHTML = `
            <div class="card text-center mb-4 ">
                <!--div encargado del contenido de la tarjeta-->
                <div class="card-body">
                    <strong>Product</strong>: ${product.name}
                    <strong>Product Price</strong>: ${product.price}
                    <strong>Product Year</strong>: ${product.year}
                </div>
            </div>
        `;

        productList.appendChild(element);
    }

    resetForm() {
        document.getElementById("product-form").reset();
    }


    deleteProduct() {

    }

    showMessage() {

    }
}



document.getElementById("product-form").addEventListener("submit", function (event) {

    const productName = document.getElementById("pName").value;
    const price = document.getElementById("pPrice").value;
    const year = document.getElementById("pYear").value;
    const dopValue = document.getElementById('srt').value;
    const bookValue = document.getElementById('book').value;

    const product = new Product(productName, price, year,dopValue,bookValue);


    const ui = new UI();
    ui.addProduct(product);
    ui.resetForm()
    
 
    event.preventDefault();

              const data =[];
              data.push("Hotel Name: "+productName)
              data.push("Amount: "+price)
			  data.push("Date: "+year)
              data.push("Payment Option: "+dopValue)
		      data.push("Book Option: "+bookValue)

              const data_string = JSON.stringify(data);

			  const file = new Blob([data_string], {type: 'text+"\n"'});

			 const anchor = document.createElement('a');
             anchor.href = URL.createObjectURL(file);
             anchor.download = ('save.Payment Slip')
             alert('Done Paid...')
			 anchor.click();

});
