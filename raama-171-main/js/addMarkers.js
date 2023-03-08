AFRAME.registerComponent("create-markers", {
  
  init: async function() {

    var mainScene = document.querySelector("#main-scene");

    //get the dishes collection from firestore database
    var dishes = await this.getDishes();
   
    dishes.map(dish => {
      var marker = document.createElement("a-marker");   
      marker.setAttribute("id", dish.id);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", dish.marker_pattern_url);
      marker.setAttribute("cursor", {
        rayOrigin: "mouse"
      });

      //set the markerhandler component
      marker.setAttribute("markerhandler", {});
      mainScene.appendChild(marker);

      // Adding 3D model to scene
      var model = document.createElement("a-entity");    
     
      model.setAttribute("id", `model-${dish.id}`);
      model.setAttribute("position", dish.model_geometry.position);
      model.setAttribute("rotation", dish.model_geometry.rotation);
      model.setAttribute("scale", dish.model_geometry.scale);
      model.setAttribute("gltf-model", `url(${dish.model_url})`);
      model.setAttribute("gesture-handler", {});
      marker.appendChild(model);

      // Ingredients Container
      var mainPlane = document.createElement("a-plane");
      mainPlane.setAttribute("id", `main-plane-${dish.id}`);
      mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
      mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
      mainPlane.setAttribute("width", 1.7);
      mainPlane.setAttribute("height", 1.5);
      marker.appendChild(mainPlane);

      // Dish title background plane
      var titlePlane = document.createElement("a-plane");
      titlePlane.setAttribute("id", `title-plane-${dish.id}`);
      titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
      titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
      titlePlane.setAttribute("width", 1.69);
      titlePlane.setAttribute("height", 0.3);
      titlePlane.setAttribute("material", { color: "#F0C30F" });
      mainPlane.appendChild(titlePlane);

      // Dish title
      var dishTitle = document.createElement("a-entity");
      dishTitle.setAttribute("id", `dish-title-${dish.id}`);
      dishTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
      dishTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
      dishTitle.setAttribute("text", {
        font: "monoid",
        color: "black",
        width: 1.8,
        height: 1,
        align: "center",
        value: dish.dish_name.toUpperCase()
      });
      titlePlane.appendChild(dishTitle);

      // Ingredients List
      var ingredients = document.createElement("a-entity");
      ingredients.setAttribute("id", `ingredients-${dish.id}`);
      ingredients.setAttribute("position", { x: 0.3, y: 0, z: 0.1 });
      ingredients.setAttribute("rotation", { x: 0, y: 0, z: 0 });
      ingredients.setAttribute("text", {
        font: "monoid",
        color: "black",
        width: 2,
        align: "left",
        value: `${dish.ingredients.join("\n\n")}`
      });
      mainPlane.appendChild(ingredients);

      var pricePlan = document.createElement("a-image");
        pricePlan.setAttribute("id", `price-plan-${dish.id}`);
        pricePlan.setAttribute(
          "src", "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
        );
        pricePlan.setAttribute("width", 0.8);
        pricePlan.setAttribute("height", 0.8);
        pricePlan.setAttribute("position", { x: -1.3, y: 0, z: 0.3 });
        pricePlan.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        pricePlan.setAttribute("visible", false);

        //Price of the dish
        var price = document.createElement("a-entity");
        price.setAttribute("id", `price-${dish.id}`);
        price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
        price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        price.setAttribute("text", {
          font: "mozillavr",
          color: "white",
          width: 3,
          align: "center",
          value: `Only\n $${dish.price}`
        });

      
        pricePlan.appendChild(price);
        marker.appendChild(pricePlan);

    });
  },
  //function to get the dishes collection from firestore database
  getDishes: async function() {
    return await firebase
      .firestore()
      .collection("dishes")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  }
});
