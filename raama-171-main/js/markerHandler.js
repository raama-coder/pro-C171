var tableNumber=null

AFRAME.registerComponent("markerhandler", {
  init: async function () {

    //get the dishes collection from firestore database
    var dishes = await this.getDishes();

    if(tableNumber==null){
      this.askTableNumber()
    }

    //markerFound event
    this.el.addEventListener("markerFound", () => {
      var markerId = this.el.id;      
      this.handleMarkerFound(dishes, markerId);
    });

    //markerLost event
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });

  },

  handleMarkerFound: function (dishes, markerId) {

    var todaysDate = new Date()
    var todaysDay = todaysDate.getDay()
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    var dish = dishes.filter(dish => dish.id == markerId)[0]
    if (dish.unavailable_days.includes(days[todaysDay])) {
      swal({
        icon: "warning",
        title: dish.dish_name.toUpperCase(),
        text: "Dish is not available Today",
        timer: 2500,
        buttons: false
      })
    } else {
      var model = document.querySelector(`#model-${dish.id}`)
      model.setAttribute("position", dish.model_geometry.position)
      model.setAttribute("rotation", dish.model_geometry.rotation)
      model.setAttribute("scale", dish.model_geometry.scale)
      model.setAttribute("visble", true)
    }
    
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "flex";

    var ratingButton = document.getElementById("rating-button");
    var orderButtton = document.getElementById("order-button");

    // Handling Click Events
    ratingButton.addEventListener("click", function () {
      swal({
        icon: "warning",
        title: "Rate Dish",
        text: "Work In Progress"
      });
    });

    orderButtton.addEventListener("click", () => {
      swal({
        icon: "https://i.imgur.com/4NZ6uLY.jpg",
        title: "Thanks For Order !",
        text: "Your order will serve soon on your table!"
      });
    });

    // Changing Model scale to initial scale
    var dish = dishes.filter(dish => dish.id === markerId)[0];

    var model = document.querySelector(`#model-${dish.id}`);
    model.setAttribute("position", dish.model_geometry.position);
    model.setAttribute("rotation", dish.model_geometry.rotation);
    model.setAttribute("scale", dish.model_geometry.scale);
  },

  handleMarkerLost: function () {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },
  //get the dishes collection from firestore database
  getDishes: async function () {
    return await firebase
      .firestore()
      .collection("dishes")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  },

  askTableNumber: function(){
    var iconName="https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/hunger.png"
    swal({
      icon: iconName,
      title: "Welcome to Hunger!",
      content:{element:input, attributes:{placeholder:"Please Enter Table Number", type:"number", min:1}},
      closeOnClickOutside:false
    }).then(inputValue=>{tableNumber=inputValue});
  }
});
