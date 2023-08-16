const basketValue = JSON.parse(localStorage.getItem("kanapLs"));

const fetchApi = async () => {
  // Retrieve the cart items from LocalStorage, or initialize an empty array if it's null
  const basketClassFull = JSON.parse(localStorage.getItem("kanapLs")) || [];
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

///// DOM display function ////////
const showBasket = async () => {
  // Fetch the product information from the server and wait for the response
  const responseFetch = await fetchApi();

  // Retrieve the items from the local storage
  const basketValue = JSON.parse(localStorage.getItem("kanapLs"));

  // Check if there are items in the basket
  if (basketValue !== null && basketValue.length !== 0) {
    // Get the DOM element where the cart items will be displayed
    const zoneBasket = document.querySelector("#cart__items");

    // Loop through each product in the fetched response
    responseFetch.forEach((product) => {
      // Generate HTML content for each product and append it to the cart container
      zoneBasket.innerHTML += `<article class="cart__item" data-id="${product._id}" data-color="${product.color}" data-name="${product.name}">
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
const getBasket = () => JSON.parse(localStorage.getItem("kanapLs"));

// modifying the number of items in the cart
async function modifyQuantity() {
  await fetchApi(); // Wait for the fetch to be finished
  const quantityInCart = document.querySelectorAll(".itemQuantity");

  for (let input of quantityInCart) {
    input.addEventListener("change", function () {
      //Listening for the quantity change.
      let basketValue = getBasket();
      let productName = this.closest(".cart__item").dataset.name;
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
        if (findColor) {
          findColor.quantity = this.value;
          if (findColor.quantity > 101) {
            alert("Product " + productName + " quantity is greater than 100");
          } else {
            // Update the basketValue and save it to local storage
            localStorage.setItem("kanapLs", JSON.stringify(basketValue));
          }
        }

        // Update the quantities and total price
        calculQtyTotal();
        calculPrixTotal();
      } else {
        // Update the basketValue and save it to local storage
        localStorage.setItem("kanapLs", JSON.stringify(basketValue));
        // Update the quantities and total price
        calculQtyTotal();
        calculPrixTotal();
      }
    });
  }
}

// remove item from the cart//
async function removeItem() {
  await fetchApi();
  const kanapDelete = document.querySelectorAll(".deleteItem");

  kanapDelete.forEach((article) => {
    article.addEventListener("click", function (event) {
      let basketValue = getBasket();
      const { id, color } = event.target.closest("article").dataset;
      basketValue = basketValue.filter(
        (item) =>
          item.idSelectedProduct !== id || item.colorSelectedProduct !== color
      );

      console.log("basketValue after filter", basketValue);
      localStorage.setItem("kanapLs", JSON.stringify(basketValue));
      const getSection = document.querySelector("#cart__items");
      getSection.removeChild(event.target.closest("article"));
      alert("Article deleted!");
      calculQtyTotal();
      calculPrixTotal();
    });
  });

  if (!getBasket()?.length) {
    localStorage.clear();
    return messageEmptyBasket();
  }
}
removeItem();
/// Message if the cart is empty //
const messageEmptyBasket = () => {
  const cartTitle = document.querySelector(
    "#limitedWidthBlock div.cartAndFormContainer > h1"
  );
  const emptyCartMessage = "Oops! Your cart is empty !";

  cartTitle.textContent = emptyCartMessage;
  cartTitle.style.fontSize = "40px";

  document.querySelector(".cart__order").style.display = "none";
  document.querySelector(".cart__price").style.display = "none";
};

const calculQtyTotal = () => {
  const basketValue = getBasket();
  const zoneTotalQuantity = document.querySelector("#totalQuantity");
  const quantityInBasket =
    basketValue?.map((item) => parseInt(item.quantity)) || [];
  const totalQuantity = quantityInBasket.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  if (totalQuantity === 0) {
    messageEmptyBasket();
  } else {
    zoneTotalQuantity.textContent = totalQuantity;
  }
};
// Function to calculate the total price and update the DOM
async function calculPrixTotal() {
  const responseFetch = await fetchApi();
  let basketValue = getBasket();
  const zoneTotalPrice = document.querySelector("#totalPrice");
  finalTotalPrice = [];

  for (let p = 0; p < responseFetch.length; p++) {
    // Product of the unit price and quantity
    let sousTotal =
      parseInt(responseFetch[p].quantity) * parseInt(responseFetch[p].price);
    finalTotalPrice.push(sousTotal);
  }

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  zoneTotalPrice.textContent = finalTotalPrice.reduce(reducer, 0);
}

modifyQuantity();
removeItem();

//push the cart into the local storage
localStorage.setItem("kanapLs", JSON.stringify(basketValue));
/// Initialization of the functions ///////////

initialize();

async function initialize() {
  showBasket(); ////// Displaying the DOM (with a reminder of the fetchApi) //////
  removeItem(); ////// Dynamic removal of items from the cart and...
  modifyQuantity(); ////// Modification of quantities

  calculQtyTotal(); ////// Dynamic update of quantities and total prices
  calculPrixTotal();
}

// Declaration of different input fields and error message areas //
const zoneFirstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
const zoneLastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
const zoneAddressErrorMsg = document.querySelector("#addressErrorMsg");
const zoneCityErrorMsg = document.querySelector("#cityErrorMsg");
const zoneEmailErrorMsg = document.querySelector("#emailErrorMsg");

const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputEmail = document.getElementById("email");
// Declaration of regular expressions for form input validation //

const regexFirstName = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
const regexLastName = regexFirstName;
const regexAddress = /^[#.0-9a-zA-ZÀ-ÿ\s,-]{2,60}$/;
const regexCity = regexFirstName;
const regexEmail =
  /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/;

// Listening to the click on the ORDER button //

const zoneOrderButton = document.querySelector("#order");

// Add a click event listener to the order button
zoneOrderButton.addEventListener("click", function (e) {
  e.preventDefault(); //Prevent the form from functioning by default if no content is provided

  // Retrieving the inputs from the form //
  let checkFirstName = inputFirstName.value;
  let checkLastName = inputLastName.value;
  let checkAddress = inputAddress.value;
  let checkCity = inputCity.value;
  let checkEmail = inputEmail.value;

  // Implementation of the validation conditions for the form fields //

  function orderValidation() {
    let basketValue = getBasket();

    // If an error is found, a message is returned, and the value 'false' as well //

    if (
      regexFirstName.test(checkFirstName) == false ||
      checkFirstName === null
    ) {
      zoneFirstNameErrorMsg.innerHTML = "Please enter a valid first name";
      return false;
    } else if (
      regexLastName.test(checkLastName) == false ||
      checkLastName === null
    ) {
      zoneLastNameErrorMsg.innerHTML = "Please enter a valid family name";
      return false;
    } else if (
      regexAddress.test(checkAddress) == false ||
      checkAddress === null
    ) {
      zoneAddressErrorMsg.innerHTML =
        "Please enter a valid address (Number, street, street name, postal code).";
      return false;
    } else if (regexCity.test(checkCity) == false || checkCity === null) {
      zoneCityErrorMsg.innerHTML = "Please enter a valid city name.";
      return false;
    } else if (regexEmail.test(checkEmail) == false || checkEmail === null) {
      zoneEmailErrorMsg.innerHTML = "Please provide a valid email address.";
      return false;
    }
    // If all the fields of the form are correctly filled //
    else {
      // create a contact object for sending through the API//

      let contact = {
        firstName: checkFirstName,
        lastName: checkLastName,
        address: checkAddress,
        city: checkCity,
        email: checkEmail,
      };

      // create an empty array that will store the items from the cart to send to the API //

      let products = [];

      //  POST request only takes into account the IDs of the products in the cart //
      // Only push the IDs of the sofas in the cart into the created array //

      for (let canapId of basketValue) {
        products.push(canapId.idSelectedProduct);
      }

      // creating the object containing the order information //

      let finalOrderObject = { contact, products };

      // Retrieval of the order ID after the POST fetch to the API //

      const orderId = fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(finalOrderObject),
        headers: {
          "Content-type": "application/json",
        },
      });

      orderId.then(async function (response) {
        // API response //
        const retour = await response.json();
        // Clear the cart by removing items from local storage
        localStorage.removeItem("kanapLs");
        // Navigate to the confirmation page with the order ID
        window.location.href = `confirmation.html?orderId=${retour.orderId}`;
      });
    }
  }

  orderValidation();
});
