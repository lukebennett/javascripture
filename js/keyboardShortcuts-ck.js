/*global javascripture*/(function(e){"use strict";var t=!1,n=!1,r;e(document).on("keydown",function(i){if(e("input:focus").length===0){27===i.keyCode&&e(".popup").popup("close");if(i.which>48&&i.which<58){var s=i.which-48,o=javascripture.modules.reference.getReferenceFromUrl();n&&(s=""+o.chapter+s);n=!0;clearTimeout(r);javascripture.data.english[o.book][s]&&(window.location.hash="#book="+o.book+"&chapter="+s);r=setTimeout(function(){n===!0&&(n=!1)},1e3)}if(i.keyCode===18)t=!0;else{if(t){var u=e("#keyCode"+i.keyCode);if(u.length>0){i.preventDefault();e("#keyCode"+i.keyCode).click()}if(i.keyCode===14||i.keyCode===16||i.keyCode===45||i.keyCode===61)if(e("#results .collapsible-wrapper").length){var a=e("#results").find(".ui-btn-active"),f;if(i.keyCode===61||i.keyCode===14)f=a.closest("li").next().find("a");if(i.keyCode===45||i.keyCode===16)f=a.closest("li").prev().find("a");f.click();window.location=f.attr("href");f.closest("ol").scrollTo(f)}}t=!1}i.keyCode>64&&i.keyCode<91&&e("#goToReference").val("").focus()}})})(jQuery);