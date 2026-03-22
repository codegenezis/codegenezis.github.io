---
layout: null
sitemap: false 
---

    {% assign counter = 0 %}

var documents = [
{% for page in site.pages %}
  {% unless page.url contains 'assets/' or page.url contains 'css/' %}
  {
    "id": {{ forloop.index0 | jsonify }},
    "url": {{ page.url | absolute_url | jsonify }},
    "title": {{ page.title | default: "Untitled" | jsonify }},
    "body": {{ page.content | strip_html | strip_newlines | jsonify }}
  }{% unless forloop.last and site.posts.size == 0 %},{% endunless %}
  {% endunless %}
{% endfor %}

{% for post in site.posts %}
  {
    "id": {{ site.pages.size | plus: forloop.index0 | jsonify }},
    "url": {{ post.url | absolute_url | jsonify }},
    "title": {{ post.title | jsonify }},
    "body": {{ post.content | strip_html | strip_newlines | jsonify }}
  }{% unless forloop.last %},{% endunless %}
{% endfor %}
];

var idx = lunr(function () {
    this.ref('id')
    this.field('title')
    this.field('body')

    documents.forEach(function (doc) {
        this.add(doc)
    }, this)
});
function lunr_search(term) {
    document.getElementById('lunrsearchresults').innerHTML = '<ul></ul>';
    if (term) {
        document.getElementById('lunrsearchresults').innerHTML = "<p>Search results for '" + term + "'</p>" + document.getElementById('lunrsearchresults').innerHTML;
        //put results on the screen.
        var results = idx.search(term);
        if (results.length > 0) {
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var url = documents[ref]['url'];
                var title = documents[ref]['title'];
                var body = documents[ref]['body'].substring(0, 160) + '...';
                document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><span class='body'>" + body + "</span><br /><span class='url'>" + url + "</span></a></li>";
            }
        } else {
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>No results found...</li>";
        }
    }
    return false;
}

function lunr_search(term) {
    $('#lunrsearchresults').show(400);
    $("body").addClass("modal-open");

    document.getElementById('lunrsearchresults').innerHTML = `
        <div id="resultsmodal" class="modal fade show d-block theme-modal" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-dialog-scrollable shadow-lg" role="document">
                <div class="modal-content">
                    <div class="modal-header" id="modtit"> <button type="button" class="close" id="btnx" data-dismiss="modal"
                            aria-label="Close"> &times; </button> </div>
                    <div class="modal-body">
                        <ul class="mb-0"> </ul>
                    </div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>`;

    if (term) {
        document.getElementById('modtit').innerHTML = "<h3  class='modal-title'>Search results for '" + term + "'</h3>" + document.getElementById('modtit').innerHTML;
        //put results on the screen.
        var results = idx.search(term);
        if (results.length > 0) {
            //console.log(idx.search(term));
            //if results
            for (var i = 0; i < results.length; i++) {
                // more statements
                var ref = results[i]['ref'];
                var url = documents[ref]['url'];
                var title = documents[ref]['title'];
                var body = documents[ref]['body'].substring(0, 160) + '...';
                document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><small><span class='body'>" + body + "</span><br /><span class='url'>" + url + "</span></small></a></li>";
            }
        } else {
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>Sorry, no results found. Close & try a different search!</li>";
        }
    }
    return false;
}

$(function () {
    $("#lunrsearchresults").on('click', '#btnx', function () {
        $('#lunrsearchresults').hide(5);
        $("body").removeClass("modal-open");
    });
});