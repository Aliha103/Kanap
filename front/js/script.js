const zoneKanaps = document.getElementById("items"); //defining a variable in the area affected HTML

fetch("http://localhost:3000/api/products/") //request to import data by API
	.then((res) => res.json()) //received data into JSON format
	.then((data) => {
		for (let champ of data) {
			//loop to import each field from the JSON and assign it a variable
			const idKanap = champ._id;
			const photoKanap = champ.imageUrl;
			const altTexte = champ.altTxt;
			const nomKanap = champ.name;
			const speechKanap = champ.description;
			zoneKanaps.innerHTML += `<a href="./product.html?id=${idKanap}">
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