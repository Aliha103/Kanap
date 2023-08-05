const shelfKanaps = document.getElementById("items"); //defining a variable in the area affected HTML

fetch("http://localhost:3000/api/products/") //request to import data by API
	.then((res) => res.json()) //received data into JSON format
	.then((data) => {
		//JSON data is named "data" to be used as an array
		for (let uniq of data) {
			//loop to import each field from the JSON and assign it a variable
			const idKanap = uniq._id;
			const photoKanap = uniq.imageUrl;
			const altTexte = uniq.altTxt;
			const nomKanap = uniq.name;
			const speechKanap = uniq.description;
			shelfKanaps.innerHTML += `<a href="./product.html?id=${idKanap}">
        <article>
          <img src="${photoKanap}" alt="${altTexte}">
            <h3 class="productName">${nomKanap}</h3>
            <p class="productDescription">${speechKanap}</p>
        </article>
    </a>`; //the photos and info of the sofas are inserted into the HTML of the home page
		}
	})
	.catch(function (err) {  // return of an error code in the console in case of problem during the fetch
		console.log(err);
	});