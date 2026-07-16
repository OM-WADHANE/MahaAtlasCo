(function () {
  window.addEventListener("load", function () {
    document.querySelectorAll(".chip").forEach(function (c) {
      c.addEventListener("click", function () {
        var siblings = this.parentElement.querySelectorAll(".chip");
        siblings.forEach(function (s) {
          s.classList.remove("active");
        });
        this.classList.add("active");
      });
    });
  });
})();
