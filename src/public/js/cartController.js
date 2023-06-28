let addToCartById = localStorage.getItem("carrito-id");
const API_URL = "http://localhost:8080/api";
function putIntoCart(_id) {
  addToCartById = localStorage.getItem("carrito-id");
  const url = API_URL + "/carts/" + addToCartById + "/product/" + _id;

  const data = {};

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((res) => {
      alert("product add");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(JSON.stringify(error));
    });
}

if (!addToCartById) {
  alert("no id");
  const url = API_URL + "/carts";

  const data = {};

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((data) => {
      const addToCartById = localStorage.setItem("carrito-id", data._id);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(JSON.stringify(error));
    });
}

// FUNCION PARA IR AL CARRITO
let cartButtonId = localStorage.getItem("carrito-id");
const cartButton = document.getElementById("cartButton");
cartButton.addEventListener("click", function() {
  if (cartButtonId) {
    window.location.href = "/carts/" + cartButtonId;
  } else {
    alert("No se encontró un ID de carrito válido");
  }
});
