// const keywordData = [{ urls: ["link"] }];

var hostname = window.location.hostname;
var validDomains = {
  "www.amazon.com": "english",
  "www.amazon.co.uk": "english",
  "www.amazon.com.au": "english",
  "www.amazon.ca": "canadian",
  "www.amazon.es": "estonia",
  "www.amazon.it": "italian",
  "www.amazon.de": "germani",
  "www.amazon.fr": "french",
};

function parseProductHTML(url, html) {
  console.time("parseProductHTML");
  var siteLang = validDomains[hostname];
  // console.log("hostname ", hostname);
  // console.log("siteLang ", siteLang, " hostname ", hostname);

  var selectors = {
    title: {
      english: "#productTitle",
      canadian: "#productTitle",
      estonia: "#productTitle",
      italian: "#productTitle",
      germani: "#productTitle",
      french: "#productTitle",
    },
    itemWeight: {
      english: {
        list: "#detailBulletsWrapper_feature_div span:contains('Item Weight')",
        table: "#productDetails_feature_div th:contains('Item Weight')",
      },
      canadian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Item Weight')",
        table: "#productDetails_feature_div th:contains('Item Weight')",
      },
      estonia: {
        list: "#detailBulletsWrapper_feature_div span:contains('Peso del producto')",
        table: "#productDetails_feature_div th:contains('Peso del producto')",
      },
      italian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Peso articolo')",
        table: "#productDetails_feature_div th:contains('Peso articolo')",
      },
      germani: {
        list: "#detailBulletsWrapper_feature_div span:contains('Artikelgewicht')",
        table: "#productDetails_feature_div th:contains('Artikelgewicht')",
      },
      french: {
        list: "#detailBulletsWrapper_feature_div span:contains('Poids de l'article')",
        table: "#productDetails_feature_div th:contains('Poids de l'article')",
      },
    },
    bsr: {
      english: {
        list: [
          "#detailBulletsWrapper_feature_div span:contains('Best-sellers rank')",
          "#detailBulletsWrapper_feature_div span:contains('Best Sellers Rank')",
          "#SalesRank",
        ],
        table: ["#productDetails_feature_div th:contains('Best-sellers rank')", "#productDetails_feature_div th:contains('Best Sellers Rank')"],
      },
      canadian: {
        list: [
          "#detailBulletsWrapper_feature_div span:contains('Bestsellers rank')",
          "#detailBulletsWrapper_feature_div span:contains('Best Sellers Rank')",
        ],
        table: ["#productDetails_feature_div th:contains('Bestsellers rank')", "#productDetails_feature_div th:contains('Best Sellers Rank')"],
      },
      estonia: {
        list: [
          "#detailBulletsWrapper_feature_div span:contains('éxitos de ventas')",
          "#detailBulletsWrapper_feature_div span:contains('Clasificación en los más vendidos')",
        ],
        table: [
          "#productDetails_feature_div th:contains('éxitos de ventas')",
          "#productDetails_feature_div th:contains('Clasificación en los más vendidos')",
        ],
      },
      italian: {
        list: [
          "#detailBulletsWrapper_feature_div span:contains('best-seller')",
          "#detailBulletsWrapper_feature_div span:contains('classifica Bestseller')",
        ],
        table: [
          "#productDetails_feature_div th:contains('classifica Bestseller')",
          "#productDetails_feature_div th:contains('classifica Bestseller')",
        ],
      },
      germani: {
        list: ["#detailBulletsWrapper_feature_div span:contains('Bestseller-Rang')"],
        table: ["#productDetails_feature_div th:contains('Bestseller-Rang')"],
      },
      french: {
        list: ["#detailBulletsWrapper_feature_div span:contains('Classement des meilleures')"],
        table: ["#productDetails_feature_div th:contains('Classement des meilleures')"],
      },
    },
    bsrHTML: {
      english: {
        list: [
          "#detailBulletsWrapper_feature_div span:contains('Best-sellers rank') ul li",
          "#detailBulletsWrapper_feature_div span:contains('Best Sellers Rank') ul li",
        ],
        table: ["#productDetails_feature_div th:contains('Best-sellers rank') ul li", "#productDetails_feature_div th:contains('Best Sellers Rank')"],
      },
      canadian: {
        list: [
          "#detailBulletsWrapper_feature_div span:contains('Bestsellers rank') ul li",
          "#detailBulletsWrapper_feature_div span:contains('Best Sellers Rank')",
        ],
        table: ["#productDetails_feature_div th:contains('Bestsellers rank') ul li", "#productDetails_feature_div th:contains('Best Sellers Rank')"],
      },
      estonia: {
        list: ["#detailBulletsWrapper_feature_div span:contains('éxitos de ventas') ul li"],
        table: ["#productDetails_feature_div th:contains('éxitos de ventas')"],
      },
      italian: {
        list: [
          "#detailBulletsWrapper_feature_div span:contains('best-seller') ul li",
          "#detailBulletsWrapper_feature_div span:contains('classifica Bestseller') ul li",
        ],
        table: ["#productDetails_feature_div th:contains('classifica Bestseller')"],
      },
      germani: {
        list: ["#detailBulletsWrapper_feature_div span:contains('Bestseller-Rang') ul li"],
        table: ["#productDetails_feature_div th:contains('Bestseller-Rang')"],
      },
      french: {
        list: ["#detailBulletsWrapper_feature_div span:contains('Classement des meilleures') ul li"],
        table: ["#productDetails_feature_div th:contains('Classement des meilleures')"],
      },
    },
    paperback: {
      english: {
        list: "#detailBulletsWrapper_feature_div span:contains('Paperback')",
        table: "#productDetails_feature_div th:contains('Paperback')",
      },
      canadian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Paperback')",
        table: "#productDetails_feature_div th:contains('Paperback')",
      },
      estonia: {
        list: "#detailBulletsWrapper_feature_div span:contains('Tapa blanda')",
        table: "#productDetails_feature_div th:contains('Tapa blanda')",
      },
      italian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Copertina flessibile')",
        table: "#productDetails_feature_div th:contains('Copertina flessibile')",
      },
      germani: {
        list: "#detailBulletsWrapper_feature_div span:contains('Taschenbuch')",
        table: "#productDetails_feature_div th:contains('Taschenbuch')",
      },
      french: {
        list: "#detailBulletsWrapper_feature_div span:contains('Broché')",
        table: "#productDetails_feature_div th:contains('Broché')",
      },
    },
    isbn10: {
      english: {
        list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
        table: "#productDetails_feature_div th:contains('ISBN-10')",
      },
      canadian: {
        list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
        table: "#productDetails_feature_div th:contains('ISBN-10')",
      },
      estonia: {
        list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
        table: "#productDetails_feature_div th:contains('ISBN-10')",
      },
      italian: {
        list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
        table: "#productDetails_feature_div th:contains('ISBN-10')",
      },
      germani: {
        list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
        table: "#productDetails_feature_div th:contains('ISBN-10')",
      },
      french: {
        list: "#detailBulletsWrapper_feature_div span:contains('ISBN-10')",
        table: "#productDetails_feature_div th:contains('ISBN-10')",
      },
    },
    asin: {
      english: {
        list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
        table: "#productDetails_feature_div th:contains('ASIN')",
      },
      canadian: {
        list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
        table: "#productDetails_feature_div th:contains('ASIN')",
      },
      estonia: {
        list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
        table: "#productDetails_feature_div th:contains('ASIN')",
      },
      italian: {
        list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
        table: "#productDetails_feature_div th:contains('ASIN')",
      },
      germani: {
        list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
        table: "#productDetails_feature_div th:contains('ASIN')",
      },
      french: {
        list: "#detailBulletsWrapper_feature_div span:contains('ASIN')",
        table: "#productDetails_feature_div th:contains('ASIN')",
      },
    },
    publisher: {
      english: {
        list: "#detailBulletsWrapper_feature_div span:contains('Publisher')",
        table: "#productDetails_feature_div th:contains('Publisher')",
      },
      canadian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Publisher')",
        table: "#productDetails_feature_div th:contains('Publisher')",
      },
      estonia: {
        list: "#detailBulletsWrapper_feature_div span:contains('Editorial')",
        table: "#productDetails_feature_div th:contains('Editorial')",
      },
      italian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Editore')",
        table: "#productDetails_feature_div th:contains('Editore')",
      },
      germani: {
        list: "#detailBulletsWrapper_feature_div span:contains('Herausgeber')",
        table: "#productDetails_feature_div th:contains('Herausgeber')",
      },
      french: {
        list: "#detailBulletsWrapper_feature_div span:contains('Éditeur')",
        table: "#productDetails_feature_div th:contains('Éditeur')",
      },
    },
    manufacturer: {
      english: {
        list: "#detailBulletsWrapper_feature_div span:contains('Manufacturer')",
        table: "#productDetails_feature_div th:contains('Manufacturer')",
      },
      canadian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Manufacturer')",
        table: "#productDetails_feature_div th:contains('Manufacturer')",
      },
      estonia: {
        list: "#detailBulletsWrapper_feature_div span:contains('Fabricante')",
        table: "#productDetails_feature_div th:contains('Fabricante')",
      },
      italian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Produttore')",
        table: "#productDetails_feature_div th:contains('Produttore')",
      },
      germani: {
        list: "#detailBulletsWrapper_feature_div span:contains('Hersteller')",
        table: "#productDetails_feature_div th:contains('Hersteller')",
      },
      french: {
        list: "#detailBulletsWrapper_feature_div span:contains('Fabricant')",
        table: "#productDetails_feature_div th:contains('Fabricant')",
      },
    },
    ratings: {
      english: {
        list: "#acrCustomerReviewText",
        table: "#acrCustomerReviewText",
      },
      canadian: {
        list: "#acrCustomerReviewText",
        table: "#acrCustomerReviewText",
      },
      estonia: {
        list: "#acrCustomerReviewText",
        table: "#acrCustomerReviewText",
      },
      italian: {
        list: "#acrCustomerReviewText",
        table: "#acrCustomerReviewText",
      },
      germani: {
        list: "#acrCustomerReviewText",
        table: "#acrCustomerReviewText",
      },
      french: {
        list: "#acrCustomerReviewText",
        table: "#acrCustomerReviewText",
      },
    },
    productDimensions: {
      english: {
        list: "#detailBulletsWrapper_feature_div span:contains('Product Dimensions')",
        table: "#productDetails_feature_div th:contains('Product Dimensions')",
      },
      canadian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Product Dimensions')",
        table: "#productDetails_feature_div th:contains('Product Dimensions')",
      },
      estonia: {
        list: "#detailBulletsWrapper_feature_div span:contains('Dimensiones del producto')",
        table: "#productDetails_feature_div th:contains('Dimensiones del producto')",
      },
      italian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Dimensioni')",
        table: "#productDetails_feature_div th:contains('Dimensioni')",
      },
      germani: {
        list: "#detailBulletsWrapper_feature_div span:contains('Verpackungsabmessungen')",
        table: "#productDetails_feature_div th:contains('Verpackungsabmessungen')",
      },
      french: {
        list: "#detailBulletsWrapper_feature_div span:contains('Dimensions du produit')",
        table: "#productDetails_feature_div th:contains('Dimensions du colis')",
      },
    },
    size: {
      english: {
        list: "#detailBulletsWrapper_feature_div span:contains('Size')",
        table: "#productDetails_feature_div th:contains('Size')",
      },
      canadian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Size')",
        table: "#productDetails_feature_div th:contains('Size')",
      },
      estonia: {
        list: "#detailBulletsWrapper_feature_div span:contains('Tamaño')",
        table: "#productDetails_feature_div th:contains('Tamaño')",
      },
      italian: {
        list: "#detailBulletsWrapper_feature_div span:contains('Size')",
        table: "#productDetails_feature_div th:contains('Size')",
      },
      germani: {
        list: "#detailBulletsWrapper_feature_div span:contains('Größe')",
        table: "#productDetails_feature_div th:contains('Größe')",
      },
      french: {
        list: "#detailBulletsWrapper_feature_div span:contains('Taille')",
        table: "#productDetails_feature_div th:contains('Taille')",
      },
    },
    authorsNode: {
      english: {
        list: "#bylineInfo_feature_div span.author",
        table: "#bylineInfo_feature_div span.author",
      },
      canadian: {
        list: "#bylineInfo_feature_div span.author",
        table: "#bylineInfo_feature_div span.author",
      },
      estonia: {
        list: "#bylineInfo_feature_div span.author",
        table: "#bylineInfo_feature_div span.author",
      },
      italian: {
        list: "#bylineInfo_feature_div span.author",
        table: "#bylineInfo_feature_div span.author",
      },
      germani: {
        list: "#bylineInfo_feature_div span.author",
        table: "#bylineInfo_feature_div span.author",
      },
      french: {
        list: "#bylineInfo_feature_div span.author",
        table: "#bylineInfo_feature_div span.author",
      },
    },
    paperbackPrice: {
      english: "#tmmSwatches a:contains('Paperback')",
      canadian: "#tmmSwatches a:contains('Paperback')",
      estonia: "#tmmSwatches a:contains('Tapa blanda')",
      italian: "#tmmSwatches a:contains('Copertina flessibile')",
      germani: "#tmmSwatches a:contains('Taschenbuch')",
      french: "#tmmSwatches a:contains('Broché')",
    },
    kindlePrice: {
      english: "#tmmSwatches a:contains('Kindle')",
      canadian: "#tmmSwatches a:contains('Kindle')",
      estonia: "#tmmSwatches a:contains('Versión Kindle')",
      italian: "#tmmSwatches a:contains('Formato Kindle')",
      germani: "#tmmSwatches a:contains('Kindle')",
      french: "#tmmSwatches a:contains('Format Kindle')",
    },
    spiralBoundPrice: {
      english: "#tmmSwatches a:contains('Spiral-bound')",
      canadian: "#tmmSwatches a:contains('Spiral-bound')",
      estonia: "#tmmSwatches a:contains('Encuadernación en espiral')",
      italian: "#tmmSwatches a:contains('Spiral-bound')",
      germani: "#tmmSwatches a:contains('Spiral-bound')",
      french: "#tmmSwatches a:contains('Spiral-bound')",
    },
    hardcoverPrice: {
      english: "#tmmSwatches a:contains('Hardcover')",
      canadian: "#tmmSwatches a:contains('Hardcover')",
      estonia: "#tmmSwatches a:contains('Tapa dura')",
      italian: "#tmmSwatches a:contains('Copertina rigida')",
      germani: "#tmmSwatches a:contains('Gebundenes Buch')",
      french: "#tmmSwatches a:contains('Relié')",
    },
    mp3Price: {
      english: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary",
      canadian: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary",
      estonia: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary",
      italian: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary",
      germani: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary",
      french: "#tmmSwatches a:contains('MP3 CD') .a-size-base.a-color-secondary",
    },
    audiobookPrice: {
      english: "#tmmSwatches a:contains('Audiobook') .a-size-base.a-color-secondary",
      canadian: "#tmmSwatches a:contains('Audiobook') .a-size-base.a-color-secondary",
      estonia: "#tmmSwatches a:contains('CD de audio') .a-size-base.a-color-secondary",
      italian: "#tmmSwatches a:contains('Audiolibro') .a-size-base.a-color-secondary",
      germani: "#tmmSwatches a:contains('Hörbuch') .a-size-base.a-color-secondary",
      french: "#tmmSwatches a:contains('Téléchargement audio') .a-size-base.a-color-secondary",
    },
    insideBoxPrice: {
      english: "#price_inside_buybox",
      canadian: "#price_inside_buybox",
      estonia: "#price_inside_buybox",
      italian: "#price_inside_buybox",
      germani: "#price_inside_buybox",
      french: "#price_inside_buybox",
    },
  };

  // var parsed = $("<div>").append($(html));
  html = html.replace(/<img[^>]*>/g, "");
  console.log("html", url);
  var parsed = $(html);
  var title = parsed.find(selectors.title[siteLang]).text().trim();
  // Get product details
  var itemWeight = 0;
  var bsr = 0;
  var bsrHTML = [];
  var paperback = 0;
  var isbn10 = 0;
  var seller = "";
  var ratings = 0;
  var productDimensions = "";
  var authorsNode = null;
  var authors = [];

  // Determine product details layout
  if (parsed.find("#detailBulletsWrapper_feature_div").length || parsed.find("#productDetailsTable").length) {
    // Get product details
    itemWeight = parsed
      .find(selectors.itemWeight[siteLang]["list"])
      .text()
      .match(/\d+((.|,)\d+)?/);
    if (Array.isArray(itemWeight)) {
      itemWeight = itemWeight[0];
    }

    bsr = null;
    selectors.bsr[siteLang]["list"].forEach((selector) => {
      if (parsed.find(selector).text() !== null && parsed.find(selector).text() !== "") {
        bsr = parsed
          .find(selector)
          .text()
          .trim()
          .match(/\d+((.|,)\d+)+((.|,)\d+)+((.|,)\d+)?/);
        if (!bsr)
          bsr = parsed
            .find(selector)
            .text()
            .match(/\d+((.|,)\d+)?/);
        // .match(/(?<=#)(.*?)(?=in)/);
      }
    });

    if (Array.isArray(bsr)) {
      bsr = bsr[0];
    }

    // Get bsr html
    bsrHTML = [];
    selectors.bsrHTML[siteLang]["list"].forEach((selector) => {
      if (parsed.find(selector).html() !== undefined) {
        bsrHTML.push("<li>" + parsed.find(selector).html() + "</li>");
      }
    });
    bsrHTML = bsrHTML.join("");

    paperback = parsed
      .find(selectors.paperback[siteLang]["list"])
      .text()
      .match(/\d+((.|,)\d+)?/);
    if (Array.isArray(paperback)) {
      paperback = paperback[0];
    }

    isbn10 = parsed
      .find(selectors.isbn10[siteLang]["list"])
      .next("span")
      .text()
      .match(/\d+((.|,)\d+)?/);
    if (!isbn10) {
      isbn10 = parsed.find(selectors.asin[siteLang]["list"]).next("span").text().trim();
    }
    if (Array.isArray(isbn10)) {
      isbn10 = isbn10[0];
    }

    seller = parsed.find(selectors.publisher[siteLang]["list"]).next("span").text();
    if (!seller) {
      seller = parsed.find(selectors.manufacturer[siteLang]["list"]).next("td").text().trim();
    }

    ratings = parsed
      .find(selectors.ratings[siteLang]["list"])
      .text()
      .match(/\d+((.|,)\d+)?/);
    if (Array.isArray(ratings)) {
      ratings = ratings[0];
    }

    productDimensions = parsed.find(selectors.productDimensions[siteLang]["list"]).next("span").text();
    if (!productDimensions) {
      productDimensions = parsed.find(selectors.size[siteLang]["list"]).next("span").text();
    }

    authorsNode = parsed.find(selectors.authorsNode[siteLang]["list"] + " a.contributorNameID");
    if (authorsNode.length <= 0) {
      authorsNode = parsed.find(selectors.authorsNode[siteLang]["list"] + " a");
    }
    authors = [];
    for (var m = 0; m < authorsNode.length; m++) {
      authors.push(authorsNode[m].innerText.trim().replace(/,/g, ""));
    }
  } else if (parsed.find("#productDetails_feature_div").length) {
    // Get product details
    itemWeight = parsed
      .find(selectors.itemWeight[siteLang]["table"])
      .next("td")
      .text()
      .match(/\d+((.|,)\d+)?/);
    if (Array.isArray(itemWeight)) {
      itemWeight = itemWeight[0];
    }

    selectors.bsr[siteLang]["table"].forEach((selector) => {
      if (parsed.find(selector).next("td").text() !== null && parsed.find(selector).next("td").text() !== "") {
        bsr = parsed
          .find(selector)
          .next("td")
          .text()
          // .match(/\d+((.|,)\d+)?/);
          // .match(/(?<=#)(.*?)(?=in)/);
          .match(/\d+((.|,)\d+)+((.|,)\d+)+((.|,)\d+)?/);

        if (!bsr)
          bsr = parsed
            .find(selector)
            .next("td")
            .text()
            .match(/\d+((.|,)\d+)?/);
      }
    });
    if (Array.isArray(bsr)) {
      bsr = bsr[0];
    }

    // Get bsr html
    bsrHTML = "";
    selectors.bsrHTML[siteLang]["table"].forEach((selector) => {
      if (parsed.find(selector).next("td").html() !== null && parsed.find(selector).next("td").html() !== undefined) {
        bsrHTML = parsed.find(selector).next("td").html();
      }
    });

    paperback = parsed
      .find(selectors.paperback[siteLang]["table"])
      .next("td")
      .text()
      .match(/\d+((.|,)\d+)?/);
    if (Array.isArray(paperback)) {
      paperback = paperback[0];
    }

    isbn10 = parsed
      .find(selectors.isbn10[siteLang]["table"])
      .next("td")
      .text()
      .match(/\d+((.|,)\d+)?/);
    if (!isbn10) {
      isbn10 = parsed.find(selectors.asin[siteLang]["table"]).next("td").text().trim();
    }
    if (Array.isArray(isbn10)) {
      isbn10 = isbn10[0];
    }

    seller = parsed.find(selectors.publisher[siteLang]["table"]).next("td").text().trim();
    if (!seller) {
      seller = parsed.find(selectors.manufacturer[siteLang]["table"]).next("td").text().trim();
    }

    ratings = parsed
      .find(selectors.ratings[siteLang]["table"])
      .next("td")
      .text()
      .match(/\d+((.|,)\d+)?/);

    if (!ratings) {
      ratings = parsed
        .find(selectors.ratings[siteLang]["table"])
        .text()
        .match(/\d+((.|,)\d+)?/);
    }
    if (Array.isArray(ratings)) {
      ratings = ratings[0];
    }

    // console.log('ratings', ratings);

    productDimensions = parsed.find(selectors.productDimensions[siteLang]["table"]).next("td").text().trim();
    // console.log("productDimensions", siteLang, selectors.productDimensions[siteLang]['table'])
    if (!productDimensions) {
      productDimensions = parsed.find(selectors.size[siteLang]["table"]).next("td").text().trim();
      // console.log("size", siteLang, selectors.size[siteLang]['table']);
    }

    authorsNode = parsed.find(selectors.authorsNode[siteLang]["table"] + " a.contributorNameID");
    if (authorsNode.length <= 0) {
      authorsNode = parsed.find(selectors.authorsNode[siteLang]["table"] + " a");
    }
    authors = [];
    for (var m = 0; m < authorsNode.length; m++) {
      authors.push(authorsNode[m].innerText.trim().replace(/,/g, ""));
    }
  } else {
    // console.log("layout not found", product);
  }

  // Get price
  var price = 0;
  var paperbackPrice = parsed
    .find(selectors.paperbackPrice[siteLang])
    .text()
    .match(/\d+((.|,)\d+)?/);
  var kindlePrice = parsed
    .find(selectors.kindlePrice[siteLang])
    .text()
    .match(/\d+((.|,)\d+)?/);
  var spiralBoundPrice = parsed
    .find(selectors.spiralBoundPrice[siteLang])
    .text()
    .match(/\d+((.|,)\d+)?/);
  var hardcoverPrice = parsed
    .find(selectors.hardcoverPrice[siteLang])
    .text()
    .match(/\d+((.|,)\d+)?/);
  var mp3Price = parsed
    .find(selectors.mp3Price[siteLang])
    .text()
    .match(/\d+((.|,)\d+)?/);
  var audiobookPrice = parsed
    .find(selectors.audiobookPrice[siteLang])
    .text()
    .match(/\d+((.|,)\d+)?/);
  var insideBoxPrice = parsed
    .find(selectors.insideBoxPrice[siteLang])
    .text()
    .match(/\d+((.|,)\d+)?/);
  if (paperbackPrice !== null) {
    price = paperbackPrice;
  } else if (kindlePrice !== null) {
    price = kindlePrice;
  } else if (spiralBoundPrice !== null) {
    price = spiralBoundPrice;
  } else if (hardcoverPrice !== null) {
    price = hardcoverPrice;
  } else if (mp3Price !== null) {
    price = mp3Price;
  } else if (audiobookPrice !== null) {
    price = audiobookPrice;
  } else if (insideBoxPrice !== null) {
    price = insideBoxPrice;
  }

  if (Array.isArray(price)) {
    price = price[0];
  }
  if (bsr) {
    bsr = parseFloat(bsr.replaceAll(",", "").replaceAll(".", ""));
  }

  if (Number.isNaN(bsr)) {
    bsr = 0;
  }
  console.timeEnd("parseProductHTML");

  return {
    url: url,
    title: title,
    authors: authors.join("-"),
    itemWeight: itemWeight ? itemWeight : 0,
    bsr: bsr,
    bsrHTML: bsrHTML,
    paperback: paperback ? paperback.replace(",", "").replace(".", "") : "",
    isbn10: isbn10 ? isbn10 : "",
    seller: seller,
    size: productDimensions,
    ratings: ratings ? parseInt(ratings.replace(",", "").replace(".", "")) : 0,
    price: parseFloat(price.toString().replace(",", ".")),
  };
}

if (keywordData.urls.length > 0) {
  let promiseArray = [];

  /**
   * Get BSR data
   */
  for (let l = 0; l < keywordData.urls.length; l++) {
    if (keywordData.urls[l]) {
      promiseArray.push(
        new Promise(async (resolve, reject) => {
          // HTTP request to get product details
          $.get(keywordData.urls[l], async function (html) {
            const productData = await parseProductHTML(keywordData.urls[l], html);
            resolve(productData);
          }).fail(function (error) {
            console.log("error productDetails", error);
            reject(error);
          });
        })
      );
    }
  }

  // Done all promise
  Promise.all(promiseArray).then(function (promiseData) {
    keywordData.productsData = promiseData;

    chrome.runtime.sendMessage({
      message: "bsrScoreData",
      respData: keywordData,
    });
    window.close();
  });
}
