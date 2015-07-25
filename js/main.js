mpPage("/showtime", function(data) {
  if (data) {
    $("#content").text(data.name);
  } else {
    $("#content").text("showtime");
  }
  mpPage.setData("/showtime", {name: "showtime_pop"});
});

mpPage("/fucking", function(data) {
  if (data) {
    $("#content").text(data.name);
  } else {
    $("#content").text("xxoo");
  }
  mpPage.setData("/fucking", {name: "xxoo_pop"});
  mpPage.reset();
});

mpPage.start();