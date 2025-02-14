(function () {
  function highlightTwitter() {
    const tweets = document.querySelectorAll("article");
    tweets.forEach((tweet) => {
      tweet.style.backgroundColor = "yellow";
      tweet.style.border = "2px solid red";
    });
  }

  setInterval(highlightTwitter, 2000);
})();
