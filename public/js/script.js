let hyruleRepository = (function () {
  let hyruleCompendium = [];
  let apiUrl = "https://botw-compendium.herokuapp.com/api/v2";
  let categories = [];

  // Fetch entry array
  function getAll() {
    return hyruleCompendium;
  }

  // Add entry to array
  function add(item) {
    if (typeof item !== "object") {
      console.log("Should be an object");
    } else if (
      !("name" in item) ||
      !("image" in item) ||
      !("id" in item) ||
      !("description" in item) ||
      !("category" in item)
    ) {
      console.log("Invalid keys");
    } else {
      hyruleCompendium.push(item);
    }
  }

  // Create Elements for displaying the compendium
  function addListItem(entry) {
    let compendiumList = $(".list-container");
    let listItem = $.add(li).append(compendiumList);
    listItem.addClass(".list-item");
    listItem.id = entry.id;

    // Create a img container that holds the images and id of the entry
    let imgContainer = $.create("div").append(listItem);
    imgContainer.addClass(".img-container");
    // Images
    let entryImages = $.create("img").append(imgContainer);
    entryImages.addClass(".default-loading-images");
    entryImages.attr("src", entry.image);
    // ID
    let entryId = $.create("p").append(imgContainer);
    entryId.addClass(".number");
    entryId.innerHTML = entry.id;
    // borderImages
    let borderImages = $.create("div").append(imgContainer);
    borderImages.addClass(".object-border");
    // Name
    let entryName = $.create("p").append(listItem);
    entryName.addClass(".object-name");
    entryName.innerHTML = entry.name;

    clickEvent(listItem, entry);

    // Adding Content in modal container
    $(".modal-content-header").innerHTML = entry.id + " " + entry.name;
    $(".modal-content-category").innerHTML = entry.category;
    $(".modal-content-images").innerHTML = entry.image;
    $(".modal-content-description").innerHTML = entry.description;
    $(".modal-content-location").attr("src", entry.image);
  }

  // Fetching data from API, add each specified entry to hyruleCompendium with add()
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (obj) {
        const fetched = obj.data;
        categories.push(...Object.keys(fetched));
        const categoriesList = [
          ...categories.map((category) => {
            if (category === "creatures") {
              return [...fetched[category].food, ...fetched[category].non_food];
            } else {
              return fetched[category];
            }
          }),
        ];
        const categoriesObject = categoriesList.flat();
        categoriesObject.sort((a, b) => a.id - b.id);
        categoriesObject.forEach((category) => {
          add(category);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  $(".list-item").click(function () {
    // var buttonId = $(this).attr("id");
    // $(".modal-container").removeAttr("class").addClass(buttonId);
    $(".modal-container").addClass("is-active");
    $(".modal-container").removeClass("out");
  });

  $(".modal-background").click(function () {
    $(this).addClass("out");
    $(".modal-container").removeClass("is-active");
  });

  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    // showDetails: showDetails,
    // categories: categories,
    // categoryFilter: categoryFilter,
    // loadCategories: loadCategories,
  };
})();

hyruleRepository.loadList().then(function () {
  hyruleRepository.getAll().forEach(function (entry) {
    hyruleRepository.addListItem(entry);
  });
});
