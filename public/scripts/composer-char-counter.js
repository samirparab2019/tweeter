
"use strict";

//---------------->count characters of text length
$(document).ready(function() {
  let maxCharacters = 140;
  $(".new-tweet textarea").on("keyup keydown", function(){
    let remaining = maxCharacters - this.value.length;
    const $counter = $("span.counter");
    $counter.text(remaining);
    if (maxCharacters < this.value.length) {
      $counter.addClass("over");
    } else {
      $counter.removeClass("over");
    }
  });
});




