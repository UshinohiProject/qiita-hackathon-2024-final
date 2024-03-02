function sendMoveCountToObniz(count) {
  var obnizId = PropertiesService.getScriptProperties().getProperty('OBNIZ_ID');
  var url = "https://obniz.com/obniz/" + obnizId + "/message";
  var params = '?data=' + count; // パラメータを追加

  var fullUrl = url + params;
  var response = UrlFetchApp.fetch(fullUrl);
  var content = response.getContentText();

  Logger.log(content);
}

function testSendMoveCountToObniz() {
  sendMoveCountToObniz(3);
}
