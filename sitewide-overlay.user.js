// ==UserScript==
// @name         GC Sitewide Overlay
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       probably mana
// @require      http://code.jquery.com/jquery-latest.js
// @match        https://www.grundos.cafe/*
// @exclude      https://www.grundos.cafe/userlookup/?user=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// ==/UserScript==


/*
    Put your pets' overlays here
*/
const petOverlays = {
    "DancingGreen": {
        "species": "cybunny",
        "colour": "disco",
        "circle": "https://images2.imgbox.com/64/37/DqZafVi3_o.png",
        "happy": "https://images2.imgbox.com/82/88/hq9UBelu_o.png",
        "sad": "https://images2.imgbox.com/82/88/hq9UBelu_o.png",
        "angry": "https://images2.imgbox.com/82/88/hq9UBelu_o.png",
        "beaten": "https://images2.imgbox.com/82/88/hq9UBelu_o.png",
        "closeattack": "https://images2.imgbox.com/82/88/hq9UBelu_o.png",
        "defended": "https://images2.imgbox.com/82/88/hq9UBelu_o.png",
        "hit": "https://images2.imgbox.com/82/88/hq9UBelu_o.png",
        "rangedattack": "https://images2.imgbox.com/82/88/hq9UBelu_o.png"
    },
    "HowlingBlade": {
        "species": "lupe",
        "colour": "robot",
        "circle": "https://images2.imgbox.com/7d/10/hdb9gsQO_o.png",
        "happy": "https://images2.imgbox.com/d7/48/8dEDw4X7_o.png",
        "sad": "https://images2.imgbox.com/d7/48/8dEDw4X7_o.png",
        "angry": "https://images2.imgbox.com/d7/48/8dEDw4X7_o.png",
        "beaten": "https://images2.imgbox.com/d7/48/8dEDw4X7_o.png",
        "closeattack": "https://images2.imgbox.com/d7/48/8dEDw4X7_o.png",
        "defended": "https://images2.imgbox.com/d7/48/8dEDw4X7_o.png",
        "hit": "https://images2.imgbox.com/d7/48/8dEDw4X7_o.png",
        "rangedattack": "https://images2.imgbox.com/d7/48/8dEDw4X7_o.png"
    },
    "Tamashii": {
        "species": "lupe",
        "colour": "shadow",
        "circle": "https://images2.imgbox.com/fe/00/SHTmeLIi_o.png",
        "happy": "https://images2.imgbox.com/fe/00/SHTmeLIi_o.png",
        "sad": "https://images2.imgbox.com/fe/00/SHTmeLIi_o.png",
        "angry": "https://images2.imgbox.com/fe/00/SHTmeLIi_o.png",
        "beaten": "https://images2.imgbox.com/fe/00/SHTmeLIi_o.png",
        "closeattack": "https://images2.imgbox.com/fe/00/SHTmeLIi_o.png",
        "defended": "https://images2.imgbox.com/fe/00/SHTmeLIi_o.png",
        "hit": "https://images2.imgbox.com/fe/00/SHTmeLIi_o.png",
        "rangedattack": "https://images2.imgbox.com/fe/00/SHTmeLIi_o.png"
    },
    "PET_NAME": {
        "species": "SPECIES",
        "colour": "COLOUR",
        "circle": "IMG_URL",
        "happy": "IMG_URL",
        "sad": "IMG_URL",
        "angry": "IMG_URL",
        "beaten": "IMG_URL",
        "closeattack": "IMG_URL",
        "defended": "IMG_URL",
        "hit": "IMG_URL",
        "rangedattack": "IMG_URL"
    }
};


applyOverlays();

function applyOverlays() {
    'use strict';

    applyPetOverlays();
    applyPetpetOverlays();
}

function applyPetOverlays() {
    /*
        Needs testing:
        - monthly freebies
        - zapping
        - painting
        - feeding/reading
        - pet REs
        - training school

        Not supported:
        - Zapping (text is 2 elements before)

        Note:
        - exclude rainbow pool from matching with active
    */


    const urlKeyword = "/pets/";
    const petImages = $("img[src*='" + urlKeyword + "']");

    //console.log(petImages);
    // get active information
    let activeImg = $('.aio-pet-image')[0];
    let activeSpCol = "";
    let activePet = {
        "name": "",
        "species": "",
        "colour": ""
    }

    if(activeImg != undefined) {
        activeSpCol = getSpeciesColour(activeImg.src, urlKeyword);
        activePet = {
            "name": activeImg.alt,
            "species": activeSpCol[0],
            "colour": activeSpCol[1]
        }
    }

    for (let i = 0; i < petImages.length; i++) {
        let petImage = petImages[i];
        let petUrl = petImage.src;
        let petPose = getPose(petUrl, urlKeyword);

        console.log(i + ' url: ' + petUrl);
        //console.log(petPose);

        let imgAlt = petImage.alt;
        if(imgAlt == "" && petImage.title != "") imgAlt = petImage.title;
    
        // if no matches, do not replace the url with an overlay
        let replacementUrl = petUrl;
        //console.log('alt: ' + imgAlt);

        // If can find altname in dict
        if(petOverlays[imgAlt] != undefined) {
            replacementUrl = petOverlays[imgAlt][petPose];
            //console.log('test 1 ' + imgAlt + ' ' + petPose + ' ' + replacementUrl);
        }
        // If not, then match with active pet (if applicable?) but do not match with rainbow pool listings
        else if(
            matchesActive(activePet, getSpeciesColour(petUrl, urlKeyword)) &&
            petOverlays[activePet.name] != undefined &&
            !document.location.href.includes('/rainbowpool/')
        ) {
            replacementUrl = petOverlays[activePet.name][petPose];
        }
        // If not, derive based on surrounding text
        else {
            const currSpCol = getSpeciesColour(petUrl, urlKeyword);
            const currSpecies = currSpCol[0];
            const currColour = currSpCol[1];

            // Get overlays that match the species/colour of the image
            const matchingOverlays = getPetOverlaysBySpeciesColour(currSpecies, currColour);

            let elementTexts = [];

            // if RE, get the next div's text
            if(petImage.class == 'random_event_image') {
                let reElement = getREElement(petImage);
                elementTexts.push(reElement.innerText);
            }
            // if BD, get the next next TR's text
            else if(petImage.className.includes('petpics big-image')) {
                let bdElement = getBDElement(petImage);
                elementTexts.push(bdElement.innerText);
            }

            // if not, get surrounding text
            else {
                /*
                    const prevElement = getPreviousElement(petImage);
                    const nextElement = getNextElement(petImage);

                    elementTexts.push(prevElement.innerText);
                    elementTexts.push(nextElement.innerText);
                */

                let parentElement = getParentElement(petImage);
                elementTexts.push(parentElement.innerText);
            }

            for(let j = 0; j < matchingOverlays.length; j++) {
                let matchName = matchingOverlays[j];
                
                if(containsName(elementTexts, matchName)) {
                    replacementUrl = petOverlays[matchName][petPose];
                    break;
                }
            }

            //console.log('replace with: ' + replacementUrl);
        }

        let currentHeight = petImage.height;
        let currentWidth = petImage.width;

        //console.log('replaced ' + petImage.src + ' with ' + replacementUrl);
        petImage.src = replacementUrl;
        if(currentHeight > 0) petImage.height = currentHeight;
        if(currentWidth > 0) petImage.width = currentWidth;
    }


}

function applyPetpetOverlays() {
    /*
        alt=Junior
        src=https://grundoscafe.b-cdn.net/items/littlelupe.gif
        class=aio-petpet-image pet-with-petpet

        Supported:
        - AIO sidebar
        - 
        
        Not supported:
        - Turmaculus
        - Symol Hole

        maybe look for imgs (src contains '/items/') that have an a href containing '/neopetpet'
        or class pet-with-petpet
    */
}


function containsName(texts, name) {
    for(let i = 0; i < texts.length; i++) {
        if(texts[i].includes(name)) return true;
    }
}

function getBDElement(currImage) {
    // i'm sorry this is so ugly
    return currImage.parentElement.parentElement.nextElementSibling.nextElementSibling.children[0];
}

function getREElement(currImage) {
    return currImage.parentElement.nextElementSibling;
}

function getParentElement(currImage) {
    return currImage.parentElement;
}

function getPreviousElement(currImage) {
    let currElement = currImage;
    while(true) {
        let prevElement = currElement.previousElementSibling;
        if(prevElement == null) break;

        currElement = prevElement;
        let elementText = currElement.innerText;
        if(elementText != "") break;
    }
    return currElement;
}

function getNextElement(currImage) {
    let currElement = currImage;
    while(true) {
        let nextElement = currElement.nextElementSibling;
        if(nextElement == null) break;

        currElement = nextElement;
        let elementText = currElement.innerText;
        if(elementText != "") break;
    }
    return currElement;
}

function getPetOverlaysBySpeciesColour(species, colour) {
    const matchingOverlays = [];
    for(const [currName, currValue] of Object.entries(petOverlays)) {
        const currSpecies = currValue.species;
        const currColour = currValue.colour;

        if(species == currSpecies && colour == currColour) {
            matchingOverlays.push(currName);
        }
    }
    
    return matchingOverlays;
}

function getPose(imgUrl, urlKeyword) {
    let startIndex = imgUrl.indexOf(urlKeyword) + urlKeyword.length;
    let endIndex = imgUrl.indexOf('/', startIndex);
    return imgUrl.substring(startIndex, endIndex);
}

function getTrailingUrl(imgUrl, urlKeyword) {
    let startIndex = imgUrl.indexOf(urlKeyword) + urlKeyword.length;
    return imgUrl.substring(startIndex);
}

function matchesActive(activePet, currSpCol) {
    return activePet.species == currSpCol[0] && activePet.colour == currSpCol[1];
}

function getSpeciesColour(imgUrl, urlKeyword) {
    let trailingUrl = getTrailingUrl(imgUrl, urlKeyword);

    let startIndex1 = trailingUrl.indexOf('/') + 1;
    let endIndex1 = trailingUrl.indexOf('_');
    let species = trailingUrl.substring(startIndex1, endIndex1);

    let startIndex2 = trailingUrl.indexOf('_') + 1;
    let endIndex2 = trailingUrl.indexOf('.');
    let colour = trailingUrl.substring(startIndex2, endIndex2);

    return [species, colour];
}
