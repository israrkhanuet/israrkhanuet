// Header
const csvFileDataHeader = [
  "Keyword",
  `"Comp Score"`,
  `"Total Results"`,
  `"On 1st Page"`,
  `"Avg. Reviews"`,
  "High Reviews",
  "Low Reviews",
  "Avg. Price",
  "High Price",
  "Low Price",
  "Google Search Vol",
  "Monthly Sales",
  "Independ Pub Books",
  "Avg. BSR",
  "High BSR",
  "Low BSR",
  "Keyword Score",
];

const csvFileDataHeaderIds = [
  "keywordText_",
  "competetiveness_",
  "noResults_",
  "onFirstPage_",
  "avgReviews_",
  "highReviews_",
  "lowReviews_",
  "avgPrice_",
  "highPrice_",
  "lowPrice_",
  "searchVolText_",
  "monthlySales_",
  "indp_",
  "bsr_",
  "highbsr_",
  "lowbsr_",
  "score_",
];

//create a user-defined function to download CSV file
function download_csv_file(csvFileData) {
  //define the heading for each row of the data
  // var csv = "Keyword Research\n";
  var csv = csvFileDataHeader.join(",");
  csv += "\n";

  //merge the data with CSV
  csvFileData.forEach(function (row) {
    csv += row.join(",");
    csv += "\n";
  });

  var hiddenElement = document.createElement("a");
  hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
  hiddenElement.target = "_blank";

  //provide the name for the CSV file to be downloaded
  hiddenElement.download = "Keyword Research.csv";
  hiddenElement.click();
}
