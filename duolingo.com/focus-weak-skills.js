// ==UserScript==
// @name         Focus weak skills
// @namespace    https://github.com/michojel/tampermonkey-scripts
// @version      0.2
// @description  Hide strong skills and focus weak ones in Duolingo skill tree
// @author       Michal Minář <mic.liamg@gmail.com>
// @match        https://www.duolingo.com/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/michojel/tampermonkey-scripts/master/duolingo.com/focus-weak-skills.js
// ==/UserScript==

function main() {
    $(document).ready(function() {

        const strongSkillThreshold = 3;

        generateStrengthClasses = function(prefix, strong) {
            res = [];
            min = 0;
            max = strongSkillThreshold - 1;
            if (strong) {
                min = strongSkillThreshold;
                max = 5;
            }
            for (i = min; i <= max; i++) {
                res.push(prefix + ".strength-" + i.toString());
            }
            return res;
        };

        hideStrongSkills = function() {
            $("div.tree li.skill-tree-row").filter(function(i, elem) {
                skills = $(elem).children();
                strong = skills.filter(function(i, elem) {
                    return $(elem).has(generateStrengthClasses("a span", true).join()).size() > 0;
                });
                return skills.size() == strong.size();
            }).hide();
        };

        focusFirstWeakSkill = function() {
            $("div.tree li.skill-tree-row span").has(generateStrengthClasses("a span", false).join()).filter(function(i, elem) {
                spanId = $(elem).attr("id");
                return typeof spanId == "string" && spanId.length > 0;
            }).first().focus();
        };

        previousPath = "";

        hideAndFocus = function() {
            if (location.pathname == "/" && previousPath != location.pathname) {
                hideStrongSkills();
                focusFirstWeakSkill();
            }
            previousPath = location.pathname;
            window.setTimeout(hideAndFocus, 1000);
        };

        hideAndFocus();
    });
}

// Copied from https://gist.github.com/eristoddle/4440713
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}


// load jQuery and execute the main function
addJQuery(main);
