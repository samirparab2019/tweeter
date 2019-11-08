/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

//----------------> Preventing XSS with Escaping
const escape =  function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//----------------> timestamp to tweet box
const dt = (date) => {
  const millisecondsInDay = 1000 * 60 * 60 * 24;
  const noOfDays = Math.round((Date.now() - date) / millisecondsInDay);
  return noOfDays;
};

//----------------> Create new tweet
const createTweetElement = function(tweet) {
  let $html = (`<article class="tweet">
    <header class="article-header">
      <div>
      <img class="img" src=${tweet.user.avatars}>
      <h2 class="tweet-name">${escape(tweet.user.name)}</h2>
      <h3 class="tweet-handle">${escape(tweet.user.handle)}</h3>
      </div>
    </header>
    <p class="tweet-text">${escape(tweet.content.text)}</p>
    <footer class="article-footer">  
      
      <span class="tweet-time">${(dt(tweet.created_at))} days ago</span>
      <div class="tweet-icons">
        <i class="fas fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-heart"></i>
      </div>
    </footer>
  </article>`);

  return $html;
}

//----------------> Render tweets
function renderTweets (tweets) {
  // loops through tweets
  // calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container
  const articles = $("#tweet-container")
    tweets.forEach((tweet) => {
    articles.append(createTweetElement(tweet));
  });
}

//----------------> Load tweeets
const loadTweets = function() {
  $.ajax({
    type: "GET",
    url: "/tweets",
    success: (tweetForm => renderTweets(tweetForm))
  })
}

//-----------------> AJAX POST request that sends the form data to the server
$(document).ready(function() {
  loadTweets();
  $("#tweet-form").on("submit", function(event) {
    event.preventDefault();  //We are preventing default to make it asynch behavior using AJAX since default is synchronous.
    let tweetForm = $(this).serialize();
    if ($(".textarea").val().length > 140) {
      $(".error-message").text("Character limit Exceeded, please try again!");
      $(".error-message").css('display', 'block');
    } else if ($(".textarea").val().length === 0 || $(".textarea").val() === "") {
      $(".error-message").text("Empty string or no text entered, please try again!");
      $(".error-message").css('display', 'block');
    } else {
      $.ajax({
      type: "POST",
      url: "/tweets",
      data: tweetForm, //returns "text=string"
        success: function(res) {
          $("#tweet-container").prepend(createTweetElement(res));
          $(".error-message").hide();
          $(".textarea").val('');
          $(".counter").text(140);
          console.log("POST request completed correctly.", tweetForm);
        }
      })
    }
  });

  //----------------> Click arrow to toggle the compose tweet form
  $(".arrow").on('click', function() {
    $("#tweet-form").toggle();
  }); 

  //----------------> Back to top button
  $('#myBtn').fadeOut();
  $(document).scroll(function() {
    var y = $(this).scrollTop();
    if (y > 400) {
      $('#myBtn').fadeIn();
    } else {
      $('#myBtn').fadeOut();
    }
  });
});