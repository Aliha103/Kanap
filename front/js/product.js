//Retrieve the "id" query parameter from current URL
const kanapPageId = new URLSearchParams(window.location.search).get("id");

// Selecting the DOM in which work perform
const {
  item__img: shelfImgKanap,
  title: nomKanap,
  price: prixKanap,
  description: speechKanap,
  colors: colorOptions,
  quantity: getProductQuantity,
} = document.querySelector;

// from localstorage retriving the data
const getBasket = () => JSON.parse(localStorage.getItem("kanapLS")) || [];
