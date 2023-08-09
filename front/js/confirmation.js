// Retrieve the "id" query parameter from the current URL
const kanapPageId = new URLSearchParams(window.location.search).get("orderId");

const zoneOrderId = document.getElementById("orderId");
zoneOrderId.innerHTML = `${orderIdKanap}`; // adding the orderId in the validation message //

////// Empty the LocalStorage /////////
localStorage.clear();
