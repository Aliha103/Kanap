// Retrieve the "id" query parameter from the current URL
const kanapPageId = new URLSearchParams(window.location.search).get("id");

const basketValue = JSON.parse(localStorage.getItem("kanapLS"));

const fetchApi = async () => {
  // Retrieve the cart items from LocalStorage, or initialize an empty array if it's null
  const basketClassFull = JSON.parse(localStorage.getItem("kanapLS")) || [];

  // Create an array to store the fetched objects
  const basketArrayFull = await Promise.all(
    basketClassFull.map(async (item) => {
      try {
        // Make an asynchronous fetch request to the API endpoint for each item in the cart
        const response = await fetch(
          `http://localhost:3000/api/products/${item.idSelectedProduct}`
        );

        // Parse the response as JSON to get the product details
        const canap = await response.json();

        // Create an object with the required information for each cart item
        return {
          _id: canap._id,
          name: canap.name,
          price: canap.price,
          color: item.colorSelectedProduct,
          quantity: item.quantity,
          alt: canap.altTxt,
          img: canap.imageUrl,
        };
      } catch (err) {
        // Log any errors that occur during the fetch process and return null for that item
        console.log(err);
        return null;
      }
    })
  );

  // Filter out any null values from the array (i.e., items where fetch failed)
  return basketArrayFull.filter((item) => item !== null);
};

/////// DOM display function /////
// Define an asynchronous function to show the items in the basket
const showBasket = async () => {
  // Fetch the product information from the server and wait for the response
  const responseFetch = await fetchApi();

  // Retrieve the items from the local storage
  const basketValue = JSON.parse(localStorage.getItem("kanapLS"));

  // Check if there are items in the basket
  if (basketValue !== null && basketValue.length !== 0) {
    // Get the DOM element where the cart items will be displayed
    const zoneBasket = document.querySelector("#cart__items");

    // Loop through each product in the fetched response
    responseFetch.forEach((product) => {
      // Generate HTML content for each product and append it to the cart container
      zoneBasket.innerHTML += `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
            <div class="cart__item__img">
              <img src="${product.img}" alt="Image of a sofa">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${product.color}</p>
                <p>${product.price}</p>
              </div>
              <div class="cart__item__content__setting">
                <div class="cart__item__content__setting__quantity">
                  <p>Qty : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Delete</p>
                </div>
              </div>
            </div>
          </article>`;
    });
  } else {
    // If the basket is empty, call the "messageEmptyBasket" function
    return messageEmptyBasket();
  }
};
// localstorage recovery function//
const getBasket = () => JSON.parse(localStorage.getItem("kanapLS"));

/// for changing the number of items in cart ///
async function modifyQuantity() {
  await fetchApi(); //Wait for the fetch to be finished
  const quantityInCart = document.querySelectorAll(".itemQuantity");
  for (let input of quantityInCart) {
    input.addEventListener("change", function () {
      //Listening for the quantity change.
      let basketValue = getBasket();
      //getting the ID of the modified data
      let idModif = this.closest(".cart__item").dataset.id;
      //getting the color of the modified data
      let colorModif = this.closest(".cart__item").dataset.color;
      //filter the List with the ID of the modified sofa
      let findId = basketValue.filter((e) => e.idSelectedProduct === idModif);
      //looking for the sofa with the same ID by its color
      let findColor = findId.find((e) => e.colorSelectedProduct === colorModif);
      if (this.value > 0) {
        // If the color and ID are found, we modify the quantity accordingly
        findColor.quantity = this.value;
        //push the cart into the local storage
        localStorage.setItem("kanapLS", JSON.stringify(basketValue));
        calculQtyTotal();
        calculPrixTotal();
      } else {
        calculQtyTotal();
        calculPrixTotal();
      }
      localStorage.setItem("kanapLS", JSON.stringify(basketValue));
    });
  }
}

///deleting the items by delete button ///
async function removeItem() {
  await fetchApi();
  const kanapDelete = document.querySelectorAll(".deleteItem");

  kanapDelete.forEach((article) => {
    article.addEventListener("click", function (event) {
      let basketValue = getBasket();
      const { idDelete, colorDelete } = event.target.closest("article").dataset;

      basketValue = basketValue.filter(
        (item) =>
          item.idSelectedProduct !== idDelete ||
          item.colorSelectedProduct !== colorDelete
      );

      localStorage.setItem("kanapLS", JSON.stringify(basketValue));
      const getSection = document.querySelector("#cart__items");
      getSection.removeChild(event.target.closest("article"));
      alert("Article deleted!");
      calculQtyTotal();
      calculPrixTotal();
    });
  });

  if (!getBasket()?.length) {
    localStorage.clear();
    return messagePanierVide();
  }
}

removeItem();

/// Initialization of the functions ///////////
initialize();

async function initialize() {
  showBasket(); ////// Displaying the DOM (with a reminder of the fetchApi) //////
  removeItem(); ////// Dynamic removal of items from the cart and...
  modifyQuantity(); ////// Modification of quantities

  calculQtyTotal(); ////// Dynamic update of quantities and total prices
  calculPrixTotal();
}
/// Message if the cart is empty //
const messagePanierVide = () => {
    const cartTitle = document.querySelector(
      "#limitedWidthBlock div.cartAndFormContainer > h1"
    );
    const emptyCartMessage = "Oops! Your cart is empty !";
    
    cartTitle.textContent = emptyCartMessage;
    cartTitle.style.fontSize = "40px";
    
    document.querySelector(".cart__order").style.display = "none";
    document.querySelector(".cart__price").style.display = "none";
  };
  
