mpPage("/showtime", function(data) {
  if (data) {
    $("#content").text(data.name);
  } else {
    $("#content").text("showtime");
  }
  mpPage.setData("/showtime", {name: "showtime_pop"});
});

mpPage("/fucking", {
  start: function(data) {
    if (data) {
      $("#content").append(data.img);
    } else {
      $("#content").text("xxoo");
    }
    //mpPage.setData("/fucking", {name: "xxoo_pop"});
    //mpPage.reset();
  },
  end: function() {
    var $d = $(".img-div").clone(true, true);
    mpPage.setData("/fucking", {img: $d})
  }
});

mpPage.start();