(() => {
  function getLoggedInUser() {
    try {
      return document
        .querySelector('div[data-testid="SideNav_AccountSwitcher_Button"] span')
        ?.textContent.replace("@", "")
        .trim();
    } catch (e) {
      return null;
    }
  }

  function getCurrentProfile() {
    return window.location.pathname.split("/")[1];
  }

  function verifyAccountOwnership() {
    const loggedInUser = getLoggedInUser();
    const currentProfile = getCurrentProfile();
    if (loggedInUser && currentProfile && loggedInUser !== currentProfile) {
      alert("This script can only be used on your own Following page.");
      return false;
    }
    return true;
  }

  function isFollowingYou(profileElement) {
    return profileElement.innerText.includes("Follows you");
  }

  function highlightNonFollowers() {
    document.querySelectorAll('[data-testid="UserCell"]').forEach((profile) => {
      if (!isFollowingYou(profile) && !profile.dataset.marked) {
        profile.style.backgroundColor = "#ffcccb";
        const tag = document.createElement("div");
        tag.textContent = "Not Following You";
        tag.style.color = "red";
        tag.style.fontWeight = "bold";
        profile.appendChild(tag);
        profile.dataset.marked = "true";
      }
    });
  }

  function simulateClick(element) {
    if (element) {
      element.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    }
  }

  function addBulkUnfollowButton() {
    if (document.getElementById("unfollowNonFollowers")) return;

    const button = document.createElement("button");
    button.id = "unfollowNonFollowers";
    button.textContent = "Unfollow Non-Followers";
    Object.assign(button.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      padding: "10px",
      backgroundColor: "red",
      color: "white",
      border: "none",
      cursor: "pointer",
      zIndex: "9999",
    });
    document.body.appendChild(button);

    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-testid='UserCell']")
        .forEach((profile) => {
          if (profile.style.backgroundColor === "rgb(255, 204, 203)") {
            const unfollowButton =
              profile.querySelector(
                "div[role='button'][data-testid='unfollow']"
              ) ||
              profile.querySelector(
                "div[role='button']:has(span > span:contains('Following'))"
              );
            if (unfollowButton) {
              simulateClick(unfollowButton);
              setTimeout(() => {
                const confirmButton = document.querySelector(
                  "div[role='button']:has(span:contains('Unfollow'))"
                );
                simulateClick(confirmButton);
              }, 1000);
            }
          }
        });
      alert("Unfollowed all non-followers!");
    });
  }

  function observeMutations() {
    const observer = new MutationObserver(highlightNonFollowers);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function startScript() {
    setTimeout(() => {
      if (verifyAccountOwnership()) {
        if (window.location.href.includes("/following")) {
          highlightNonFollowers();
          addBulkUnfollowButton();
          observeMutations();
        } else {
          alert("Please run this script on your Twitter Following page!");
        }
      }
    }, 5000);
  }

  startScript();
})();
