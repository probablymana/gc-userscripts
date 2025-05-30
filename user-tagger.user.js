// ==UserScript==
// @name            Grundo's Cafe - User Tagger
// @description     User tagger for Grundo's Cafe, based on diceroll123's script (https://gist.github.com/diceroll123/be1465e82d12f2d23d8a)
// @author          diceroll123, 2016+ (modified by Alexis and Mana for GC, 2025)
// @grant           GM_getValue
// @grant           GM_setValue
// @require         http://code.jquery.com/jquery-latest.js
// @match           https://www.grundos.cafe/*
// @version         0.1.5
// ==/UserScript==

$(`<style type='text/css'>
    .sw_results > .data { overflow-wrap: anywhere; }
    .userTag { display: inline-block; line-height: normal; cursor: pointer; margin-left: 4px!important; padding-inline-start: 0.2rem; padding-inline-end: 0.2rem; padding-bottom: 0.1rem; border-radius: 0.4rem; }
    .userTagImage { display: inline-block; height: 10px!important; width: 16px!important; background-repeat: no-repeat; background-image: url('data:image/png;base64,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') }
    </style>`).appendTo("head");
/*
    Added overflow word wrapping for the Shop Wizard
*/


if (!GM_getValue) {
    GM_getValue=function (key,def) {
        return localStorage[key] || def;
    };
    GM_setValue=function (key,value) {
        return localStorage[key]=value;
    };
    GM_deleteValue=function (key) {
        return delete localStorage[key];
    };
}

function getParameterByName(url, name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

function getBlackOrWhite(hex) {

    if(hex.charAt(0) != "#") {
        return "";
    }

    R = hexToR(hex);
    G = hexToG(hex);
    B = hexToB(hex);

    var o = Math.round(((R * 299) + (G * 587) + (B * 114)) / 1000);

    if(o > 125) {
        return "black";
    } else {
        return "white";
    }
}

function makeTag() {
    anchor = $('<span class="userTag" title="set a tag"></span>');
    return anchor;
}

function getTags() {
    return GM_getValue("tags", {});
}

function reloadTags() {
    tags = getTags();
    $(".userTag").each(function (k, v) {
        user = $(v).attr("username");
        if (typeof(tags[user]) === "undefined") {
            $(v).addClass("userTagImage");
            $(v).css("background-color", "");
            $(v).text("");
        } else {
            $(v).removeClass("userTagImage");
            if(typeof(tags[user]['color']) !== "undefined") {
                if(tags[user]['color'] == "") {
                    $(v).css("background-color", "");
                    $(v).css("color", "");
                } else {
                    $(v).css("background-color", tags[user]['color']);
                    $(v).css("color", getBlackOrWhite(tags[user]['color']));
                }
            }
            $(v).text(tags[user]['tag']);
        }
    });
}

tags = getTags();

/*
    - GC uses "userlookup/?user=" but im keeping the "randomfriend" ones to be sure
    - for shops, i added "browseshop/?owner="
    - :not(.user-info-icon) is to not include the user icon in the header
    - 
*/
$("a[href*='userlookup/?user=']:not(:has(div)):not(.user-info-icon), a[href*='randomfriend/?user=']:not(:has(div)), a[href*='randomfriend/?randomfriend=']:not(:has(div)), a[href*='browseshop/?owner=']:not(:has(div))").each(function (k, v) {
    let user;

    /*  
        Exclude user icon, toggle buttons, header 
    */
    let elementId = $(v).attr("id");
    if(elementId == 'show-mobile-toggle' || elementId == 'dark-mode-toggle' || elementId == 'user-info-username')
        return;

    if($(v).attr("href").includes("user=")) {
        user = getParameterByName($(v).attr("href"), "user");
    } else if($(v).attr("href").includes("randomfriend=")) {
        user = getParameterByName($(v).attr("href"), "randomfriend");
    } else {
        user = getParameterByName($(v).attr("href"), "owner");
    }
    let tag = makeTag();
    tag.attr("username", user);

    $(v).after(tag);
});


$(".userTag").on("click", function() {
    user = $(this).attr("username");

    currentTag = "";

    if(typeof(tags[user]) !== "undefined") {
        currentTag = tags[user]['tag'];
    }

    tag = prompt("Set text tag for " + user + ":", currentTag);
    tags = getTags();
    if(tag == null) {
        // user pressed cancel
        return;
    }

    if (tag == "") {
        delete tags[user];
    } else {
        if(typeof(tags[user]) === "undefined") {
            tags[user] = {}
        }
        tags[user]['tag'] = tag;

        currentColor = "";
        if(typeof(tags[user]['color']) !== "undefined") {
            currentColor = tags[user]['color'];
        }
        color = prompt("Set color for tag. HEX colors only. #00FF00 for lime green, and so on.\n\nOr leave it blank for no color. Text will show up black or white, whichever looks best on your color.", currentColor);
        if(/^#[0-9A-F]{6}$/i.test(color)) {
            tags[user]['color'] = color;
        } else {
            if(color != null) { // user pressed cancel
                if(color == "") {
                    tags[user]['color'] = color;
                } else {
                    alert("Invalid color. Must start with '#' and end with 6 hexadecimal values.");
                }
            }
        }
    }
    GM_setValue("tags", tags);
    reloadTags();
});

reloadTags();
