function main(){
  const year =2024;
  let address = "#";
  let row = 0;
  //アクセス
  let html = post(year,address);
  
  //学部にアクセス
  let faculty_list = [2,3,5,7,9];
  let faculties = {kokusyo:2,syajo:3,kogaku:5,rigaku:7,kankyo:9,kango:11};
  address = create_faculty_url(html,faculties.kokusyo);  //工学部
  html = post(year,address);
  //学部学科表示
  console.log(Parser.data(html).from('<td width="94%" style="font-size: 14px;">').to('</td>').iterate());
  
  //授業一覧
  let class_list = Parser.data(html).from('<a class="kamokuLevel3" href="../').to('">').iterate();
  address = class_list[0];
  console.log(address);
  html = post(year,address);

  //シラバス表示
  let same_class_list = create_class_url(html);
  let same_class_list_len = same_class_list.length;
  console.log(same_class_list_len);
  address = same_class_list[0];
  console.log(address);
  html = post(year, address);
  
  let item_list = Parser.data(html).from('<div class="colHeader colStyle colBorder" style="width:16%; text-align:left;">').to('</div>').iterate();
  console.log(item_list);
  let details_list = Parser.data(html).from('\r\n\t\t\t\t\t\t\t\t<div>').to('</div>').iterate();
  console.log(details_list);
  let payload = [item_list,details_list];
  let url = "https://syllabus.u-hyogo.ac.jp/slResult/"+String(year)+"/japanese/"+address;
  spreadsheet_print(payload, url,row);
  
  console.log("https://syllabus.u-hyogo.ac.jp/slResult/"+String(year)+"/japanese/"+address);
}

//visit the website which you want.
function post(year,address){
  const url = "https://syllabus.u-hyogo.ac.jp/slResult/"+String(year)+"/japanese/"+address;
  //console.log(url);
  //output
  let html = UrlFetchApp.fetch(url).getContentText();
  //console.log(html);
  return html;
}

//visit the faculty_page you want.
function create_faculty_url(html,faculty){
  let block = Parser.data(html).from('<A').to('</A>').iterate();
  let address = block[faculty].split('"')[1].split('"')[0];
  return address;
}

function create_class_url(html){
  address = Parser.data(html).from('<a href="../').to('">').iterate();
  return address;
}

//文字をスプレッドシートに挿入
function spreadsheet_print(payload,url,row){
  const SHEET_ID = "13vQBpUxpdoHQlBprvXmFu0MYi_YCkh8RCBYER87w1D0";
  let ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName("sheet1");


  sheet.getRange(1+row,1).setValue(1);

  sheet.getRange(1+row,2).setValue(payload[0][0]);
  sheet.getRange(2+row,2).setValue(payload[1][0]);

  sheet.getRange(1+row,3).setValue(payload[0][2]);
  sheet.getRange(2+row,3).setValue(payload[1][2]);

  sheet.getRange(1+row,4).setValue(payload[0][3]);
  sheet.getRange(2+row,4).setValue(payload[1][4]);

  sheet.getRange(1+row,5).setValue(payload[0][5]);
  sheet.getRange(2+row,5).setValue(payload[1][7]);
  
  sheet.getRange(1+row,6).setValue(payload[0][9]);
  sheet.getRange(2+row,6).setValue(payload[1][11]);

  sheet.getRange(1+row,7).setValue("URL");
  sheet.getRange(2+row,7).setValue(url);
  

}
