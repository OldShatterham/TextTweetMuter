// ==UserScript==
// @name         Text Tweet Muter
// @namespace    http://twitter.com/
// @namespace    TTM
// @version      1.0
// @description  Hides tweets (by certain users) that don't contain any media in your home timeline.
// @author       Ol' Shatterham
// @match        http://twitter.com/home
// @match        https://twitter.com/home
// @grant        none
// ==/UserScript==

//=================================
//== ADD USERS TO CHECK FOR HERE ==
//       (don't include @)
//=================================

var usersToCheck = ['user1','user2'];

//=================================
//=================================

(async function() {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function scan() {
        console.log("[TTM] Scanning...");
        var tweets = document.getElementsByClassName("css-1dbjc4n r-1loqt21 r-1udh08x r-o7ynqc r-1j63xyz");

        for(var i = 0; i < tweets.length; i++) {
            try {
                //Select tweet handle by finding tweet author information (first part) and selecting the @ handle (second part, third element of get ElementsByClassName result):
                var tweetHandle = tweets[i].getElementsByClassName("css-4rbku5 css-18t94o4 css-1dbjc4n r-1loqt21 r-1wbh5a2 r-dnmrzs r-1ny4l3l")[0].getElementsByClassName("css-901oao css-16my406 r-1qd0xha r-ad9z0x r-bcqeeo r-qvutc0")[2];
                //Remove leading '@'
                var authorName = tweetHandle.innerText.slice(1);


                if(usersToCheck.includes(authorName)) {
                    console.log("[TTM]    Found tweet by " + authorName + ", checking for images...");

                    //Check the amount of content nodes in the tweet (indicative of media):
                    var contentAmount = tweets[i].children[0].children[1].children[1].children.length;
                    if(contentAmount < 4) {
                        tweets[i].style.opacity = 0.1;
                        console.log("[TTM]        Tweet does not contain any media and was muted!");
                    }
                }
            } catch(err) {
                continue;
            }
        }

        console.log("[TTM] Finished scan!");
    }



    console.log("[TTM] Text Tweet Muter started, waiting for tweets to load");
    await sleep(4000);
    console.log("[TTM] Currently checking for tweets by " + usersToCheck.length + " users!");
    scan();
    console.log("[TTM] Finished initial scan!");

    //Observe for future tweets/timeline updates:
    //Source for observer code: https://stackoverflow.com/questions/33476834/run-script-on-page-change
    var obs = new MutationObserver(function(mut) {
        console.log("[TTM] Timeline update detected...");
        scan();
    });
    //Select timeline for live updates:
    obs.observe(document.getElementsByClassName('css-1dbjc4n r-kemksi r-1kqtdi0 r-1ljd8xs r-13l2t4g r-1phboty r-1jgb5lz r-11wrixw r-61z16t r-1ye8kvj r-13qz1uu r-184en5c')[0], { attributes: false, childList: true, subtree: true, characterData: false });
    console.log("[TTM] Timeline observer for live updates registered!");

})();
