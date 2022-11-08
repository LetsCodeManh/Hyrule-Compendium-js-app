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
    imagesApi.setAttribute("alt", "An image of " + entry.name);
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

    let divNameApi = document.createElement("div");
    divNameApi.classList.add("center-object-name");
    divNameApi.appendChild(nameApi);

    listItem.appendChild(divNameApi);

    // Add click Events
    listItem.addEventListener("click", (e) => {
      showDetails(entry);
    });
  }

  // Show Details Modal
  function showDetails(entry) {
    let modalContainer = document.querySelector(".modal-container");
    modalContainer.classList.add("is-active");

    function idCount(number) {
      return (number < 10 ? "00" : number < 100 ? "0" : "") + number;
    }
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
    // Adding the API ID + Name in modalContentHeader
    let modalContentHeader = document.querySelector(".modal-content-header");
    modalContentHeader.innerText =
      idCount(entry.id) + " " + entryNameCapitalized;

    let modalContentCategory = document.querySelector(
      ".modal-content-category"
    );
    modalContentCategory.innerText = entry.category;

    // Adding the API image in modalContentImage
    let modalContentImage = document.querySelector(".modal-content-image");
    modalContentImage.setAttribute("src", entry.image);
    modalContentImage.setAttribute("alt", "An image of " + entry.name);

    // Adding the API description in modalContentDescription
    let modalContentDescription = document.querySelector(
      ".modal-content-description"
    );
    modalContentDescription.innerText = entry.description;

    // Adding the API location in modalContentLocation
    let modalContentLocation = document.querySelector(
      ".modal-content-location"
    );
    let locations = "";
    if (entry.common_locations === null) {
      locations = "Unknown";
    } else {
      locations = entry.common_locations.join(", ");
    }
    modalContentLocation.innerText = locations;
  }

  // Hid Modal Details
  function hideDetails() {
    let modalContainer = document.querySelector(".modal-container");
    modalContainer.classList.remove("is-active");
  }

  // When the user presses the ESC key
  window.addEventListener("keydown", (e) => {
    let modalContainer = document.querySelector(".modal-container");
    if (e.key === "Escape" && modalContainer.classList.contains("is-active")) {
      hideDetails();
    }
  });

  // When the user clicks outside of the modal
  window.addEventListener("click", (e) => {
    let modalBackground = document.querySelector(".modal-background");
    let target = e.target;
    if (target === modalBackground) {
      hideDetails();
    }
  });

  // Filter by Category
  let categoryContainer = document.querySelector(".categories-container");

  categoryContainer.addEventListener("click", (category) => {
    // Get the value by clicking on the category container
    let categoryValue = category.target.id;

    // Check if value matches - not matches means hidden
    let categoryHidden = hyruleCompendium.filter(function (object) {
      if (object.category !== categoryValue) {
        return object;
      }
    });

    // Check if value matches - matches means show
    let categoryVisible = hyruleCompendium.filter(function (object) {
      if (object.category === categoryValue) {
        return object;
      }
    });

    // Push the visible object to the hyruleCompendium list
    categoryVisible.push(
      ...hyruleCompendium.filter(function (object) {
        return object.id.toString().includes(categoryValue);
      })
    );

    // Add the hidden class for the hidden object
    categoryHidden.map((object) => {
      document.getElementById(object.id).classList.add("hidden");
    });

    // Remove the hidden class for the visible object
    categoryVisible.map((object) => {
      document.getElementById(object.id).classList.remove("hidden");
    });
  });

  // Search by name and ID
  let value = document.getElementById("search-for-name-id");

  let clearIcon = document.querySelector(".reset-icon");

  value.addEventListener("keyup", function (e) {
    // Get the value from the input field
    let typeValue = e.target.value.toLowerCase();

    // Filter object to hide - if they don't have the same value
    let objectHidden = hyruleCompendium.filter(function (object) {
      if (
        !object.name.toLowerCase().includes(typeValue) ||
        !object.id.toString().includes(typeValue)
      ) {
        return object;
      }
    });

    // Filter object to show - if they have the same value
    let objectVisible = hyruleCompendium.filter(function (object) {
      if (
        object.name.toLowerCase().includes(typeValue) ||
        object.id.toString().includes(typeValue)
      ) {
        return object;
      }
    });

    // Push the visible object
    objectVisible.push(
      ...hyruleCompendium.filter(function (object) {
        return object.id.toString().includes(typeValue);
      })
    );

    // Add the hidden class for the hidden object
    objectHidden.map((object) => {
      document.getElementById(object.id).classList.add("hidden");
    });

    // Remove the hidden class for the visible object
    objectVisible.map((object) => {
      document.getElementById(object.id).classList.remove("hidden");
    });

    //
    if (value.value && clearIcon.style.visibility != "visible") {
      clearIcon.style.visibility = "visible";
    } else if (!value.value) {
      clearIcon.style.visibility = "hidden";
    }
  });

  clearIcon.addEventListener("click", () => {
    value.value = "";
    clearIcon.style.visibility = "hidden";
  });

  return {
    getAll: getAll,
    add: add,
    loadList: loadList,
    addListItem: addListItem,
    showDetails: showDetails,
  };
})();

hyruleRepository.loadList().then(function () {
  // addListItem on load for each entry object
  hyruleRepository.getAll().forEach(function (entry) {
    hyruleRepository.addListItem(entry);
  });
});
