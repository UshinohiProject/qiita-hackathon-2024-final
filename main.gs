function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var postData = JSON.parse(e.postData.contents);

  // A列で最初の空のセルを見つける
  var column = sheet.getRange('A:A');
  var values = column.getValues();
  var row = 0;
  while (values[row][0] !== "" && row < values.length) {
    row++;
  }

  // 空のセルにデータを書き込む
  jsonData = JSON.stringify(postData);
  if (row < values.length) {
    sheet.getRange(row + 1, 1).setValue(jsonData);
  } else {
    // もしA列全てが埋まっている場合は、新しい行を追加
    sheet.appendRow(jsonData);
  }
  processJsonData(jsonData);
}

function processJsonData(jsonData) {
  // JSONデータをパース
  var data = JSON.parse(jsonData);

  // 'pull_request' キーが存在するか確認
  if (data.hasOwnProperty('pull_request')) {
    var number = data.number; // 最初の 'number' キー
    var action = data.action; // 最初の 'action' キー

    // 'PR' シートを取得または新規作成
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('PR');
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('PR');
    }

    // 空いている一番上の行を見つける
    var lastRow = sheet.getLastRow();
    var nextRow = lastRow + 1;

    // 値を記入
    sheet.getRange(nextRow, 1).setValue(number); // A列
    sheet.getRange(nextRow, 2).setValue(action); // B列

    if (action == 'closed') {
      sendMoveCountToObniz(1);
    }
  }
}

function testProcessJsonData() {// JSONデータのテキスト
  var jsonData = '{"action":"closed","number":10235,"pull_request":{"url":"https://api.github.com/repos/Sample/sample/pulls/10235"}}';
  processJsonData(jsonData);
}

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
