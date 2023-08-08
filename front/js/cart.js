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

/////// DOM display function /////
// Define an asynchronous function to show the items in the basket
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
