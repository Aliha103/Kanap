// Retrieve the "id" query parameter from the current URL
const kanapPageId = new URLSearchParams(window.location.search).get("id");

// Fetch product data from the server based on the "kanapPageId"
fetch(`http://localhost:3000/api/products/${kanapPageId}`)
  .then((res) => res.json())
  .then((object) => {
    const imgKanap = object.imageUrl;
    const nameKanap = object.name;
    const priceKanap = object.price;
    const descriptKanap = object.description;
    const colorsKanap = object.colors;

    // creating color options in the HTML select element
    const colorOptions = document.getElementById("colors");
    colorsKanap.forEach((color) => {
      colorOptions.innerHTML += `<option value="${color}">${color}</option>`;
    });

    // Display product details on the webpage
    const zoneImgKanap = document.querySelector(".item__img");
    const nomKanap = document.querySelector("#title");
    const prixKanap = document.querySelector("#price");
    const speechKanap = document.querySelector("#description");

    zoneImgKanap.innerHTML += `<img src="${imgKanap}" alt="Sofa image">`;
    nomKanap.innerText += nameKanap;
    prixKanap.innerText += `${priceKanap} `;
    speechKanap.innerText += descriptKanap;

    // Creating a function triggered by clicking on the "Add to Cart" button
    const button = document.getElementById("addToCart");
    button.addEventListener("click", () => {
      const getProductQuantity = document.getElementById("quantity");
      const colorOptions = document.getElementById("colors");
      const basketValue = {
        idSelectedProduct: kanapPageId,
        nameSelectedProduct: nameKanap,
        colorSelectedProduct: colorOptions.value,
        quantity: getProductQuantity.value,
      };

      // Function to retrieve the cart from LocalStorage
      const getBasket = () => JSON.parse(localStorage.getItem("kanapLS")) || [];

      // Function to save the cart to LocalStorage
      const saveBasket = (basketValue) => {
        localStorage.setItem("kanapLS", JSON.stringify(basketValue));
      };

      // Adding the product to the cart
      const addBasket = (product) => {
        let basketValue = getBasket();
        let foundProduct = basketValue.find(
          (item) =>
            item.idSelectedProduct === product.idSelectedProduct &&
            item.colorSelectedProduct === product.colorSelectedProduct
        );

        if (!foundProduct) {
          if (product.colorSelectedProduct === "") {
            alert("Please choose a color.");
          } else if (product.quantity <= 0) {
            alert("Please select a correct quantity (greater than 0).");
          } else if (product.quantity > 100) {
            alert("Please select a quantity less than or equal to 100.");
          } else {
            basketValue.push(product); // Add the product to the cart
            saveBasket(basketValue);
            alert(
              `The ${product.colorSelectedProduct} ${product.nameSelectedProduct} sofa has been added to your cart in ${product.quantity} quantity!`
            );
          }
        } else {
          // Convert both quantities to numbers before adding
          let newQuantity =
            parseInt(foundProduct.quantity) + parseInt(product.quantity);
          foundProduct.quantity = newQuantity;
          saveBasket(basketValue);
          alert(
            `The quantity of the ${product.colorSelectedProduct} ${product.nameSelectedProduct} sofa has been updated in your cart. New quantity: ${foundProduct.quantity}.`
          );
        }
      };

      // Call the addBasket function to add the product to the cart
      addBasket(basketValue);
    });
  })
  .catch(function (err) {
    console.log(err);
  });
