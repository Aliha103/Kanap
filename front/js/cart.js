// Retrieve the "id" query parameter from the current URL
const kanapPageId = new URLSearchParams(window.location.search).get("id");

const basketValue = JSON.parse(localStorage.getItem("kanapLs"));

async function fetchApi() {
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
}
