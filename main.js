function main(){
  const year =2024;
  let address = "#";
  //アクセス
  let html = post(year,address);
  
  //学部にアクセス
  let faculties = {kokusyo:2,syajo:3,kogaku:5,rigaku:7,kankyo:9,kango:11};
  address = create_faculty_url(html,faculties.kokusyo);  //工学部
  html = post(year,address);
  //学部学科表示
  console.log(Parser.data(html).from('<td width="94%" style="font-size: 14px;">').to('</td>').iterate());
  
  //授業一覧
  address = Parser.data(html).from('<a class="kamokuLevel3" href="../').to('">').iterate();
  console.log(address[0]);
  html = post(year,address[0]);

  //シラバス表示
  address = create_class_url(html);
  console.log(address[0]);
  html = post(year,address[0]);
  
  console.log("https://syllabus.u-hyogo.ac.jp/slResult/"+String(year)+"/japanese/"+address[0]);
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
