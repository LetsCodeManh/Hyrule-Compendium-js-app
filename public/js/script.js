let hyruleRepository = (function () {
  let hyruleCompendium = [];
  let categories = [];

  // Return The Fetched API Collection Array
  function getAll() {
    return hyruleCompendium;
  }

  // Add API Objects to hyruleCompendium
  function add(object) {
    // Checking if get a object
    if (
      typeof object === "object" &&
      "name" in object &&
      "id" in object &&
      "category" in object &&
      "description" in object &&
      "image" in object
    ) {
      hyruleCompendium.push(object);
    } else {
      return "This is not an object, please add an object in the list!";
    }
  }

  // Fetching data from API and add to hyruleCompendium with add()
  function loadList() {
    return fetch("https://botw-compendium.herokuapp.com/api/v2")
      .then(function (response) {
        return response.json();
      })
      .then(function (obj) {
        let newObject = obj.data;
        categories.push(...Object.keys(newObject));

        // Because we have an array of food and non_food categories
        let categoriesList = [
          ...categories.map((category) => {
            if (category === "creatures") {
              return [
                ...newObject[category].food,
                ...newObject[category].non_food,
              ];
            } else {
              return newObject[category];
            }
          }),
        ];
        let categoriesObject = categoriesList.flat();
        // Sort by id
        categoriesObject.sort((a, b) => a.id - b.id);
        categoriesObject.forEach((category) => {
          add(category);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  // Adding is-active to modal container
  // function showDetails(entry) {

  // }

  // Create elements to display the objects
  function addListItem(entry) {
    let compendiumList = document.querySelector(".list-container");

    // Create a new list item
    let listItem = document.createElement("li");
    listItem.classList.add("list-item");
    listItem.setAttribute("id", entry.id);
    compendiumList.appendChild(listItem);

    // Create an image container for the list item
    let imageContainer = document.createElement("div");
    imageContainer.classList.add("img-container");
    listItem.appendChild(imageContainer);

    // Create content for the image container like images, id, and border styling
    let imagesApi = document.createElement("img");
    imagesApi.classList.add("default-loading-images");
    imagesApi.setAttribute("src", entry.image);
    imageContainer.appendChild(imagesApi);

    function idCount(number) {
      return (number < 10 ? "00" : number < 100 ? "0" : "") + number;
    }
    let idApi = document.createElement("p");
    idApi.classList.add("number");
    idApi.innerText = idCount(entry.id);
    imageContainer.appendChild(idApi);

    let borderStyle = document.createElement("div");
    borderStyle.classList.add("object-border");
    imageContainer.appendChild(borderStyle);

    // Create a paragraph for the name of the object
    const entryName = entry.name;

    //split the above string into an array of strings
    //whenever a blank space is encountered
    const arr = entryName.split(" ");

    //loop through each element of the array and capitalize the first letter.
    for (var i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    }

    //Join all the elements of the array back into a string
    //using a blankspace as a separator
    const entryNameCapitalized = arr.join(" ");

    let nameApi = document.createElement("p");
    nameApi.classList.add("object-name");
    nameApi.innerText = entryNameCapitalized;
    listItem.appendChild(nameApi);
  }

  return {
    getAll: getAll,
    add: add,
    loadList: loadList,
    addListItem: addListItem,
  };
})();

hyruleRepository.loadList().then(function () {
  // addListItem on load for each entry object
  hyruleRepository.getAll().forEach(function (entry) {
    hyruleRepository.addListItem(entry);
  });
});