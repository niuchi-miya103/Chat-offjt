﻿/**
 * Responds to a MESSAGE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
function onMessage(event) {
  var name = "";
  var message = "";
  var messageUrl = "";
  
  if (event.space.type == "DM") {
    name = "You";
  } else {
    name = event.user.displayName;
  }
  // message = name + " said \"" + event.message.text + "\"";
  message = getManualURL(event.message.text);
  return { "text": message};
  
  }

/**
 * Responds to an ADDED_TO_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 *//*
function onAddToSpace(event) {
  var message = "";

  if (event.space.type == "DM") {
    message = "Thank you for adding me to a DM, " + event.user.displayName + "!";
  } else {
    message = "Thank you for adding me to " + event.space.displayName;
  }

  if (event.message) {
    // Bot added through @mention.
    message = message + " and you said : \"" + event.message.text + "\"";
  }

  return { "text": message };
}

/**
 * Responds to a REMOVED_FROM_SPACE event in Hangouts Chat.
 *
 * @param {Object} event the event object from Hangouts Chat
 */
 
function onRemoveFromSpace(event) {
  console.info("Bot removed from ", event.space.name);
}

function getManualURL(target) {
  //var URL = "https://docs.google.com/spreadsheets/d/1X4UOyJL87Ghkp1PdIqWj0EBVd-Aop8t6VpctlRDndOo/edit#gid=0"//test
  var URL = "https://docs.google.com/spreadsheets/d/14gF_mGaMyxqxowmRM9LTySC4jmbeDqpjdXLIOX6CLxY/edit#gid=0";
  
  var ss = SpreadsheetApp.openByUrl(URL);
  var Sheet = ss.getActiveSheet();  
   
  // (1行目,1列目,　から　最終行,4列　を取得する)
  var LastRow = Sheet.getLastRow(); 
  var Range = Sheet.getRange(1,1,LastRow,4);
  var Values = Range.getValues();
  
  //全件表示用URL
  //var ALLISTURL = "https://docs.google.com/spreadsheets/d/1pyW_-keldEALlUMERMyVvTy-rdAs6xW_EciAyA739Ck/edit#gid=0";
  var ALLISTURL = "https://docs.google.com/spreadsheets/d/14gF_mGaMyxqxowmRM9LTySC4jmbeDqpjdXLIOX6CLxY/edit#gid=0";
  
  var message = "検索結果："
  var count =0;
  var andList = [];
  var Answer = [];
  var matchList = [];

   
   //id検索、完全一致
  if(target.match(/^#/)){
    var id = target;
    for(var i = 0; i<LastRow; i++){
      if(String(Values[i][0])==id){
        message = "検索結果："
        //代替テキストリンク付(蛇足)
        //message = message + "\n" + String(Values[i][1]) + "\t" +String(Values[i][2]);
        message = message + "\n" + target + ":" + "\t" + "<" + String(Values[i][2]) + "|" + String(Values[i][1]) + ">";
        break;
      }else{
        message = "IDが間違っています。お確かめの上再度入力してください";
        continue;
      }
    }
    return message;
    //全件表示
  }else if(target == "全件表示"){
    
    message = "全件リストを表示します" + "\n" + ALLISTURL;
    
    return　message;
    
  }else{
    //AND・単一統合
    //検索ワードリスト
    if(/\s+/.test(target)){
      andList = target.split(/\s+/);
    }else{
      andList.push(target);
    }

    for(var i =0; i<LastRow; i++){
      //検索対象リストをつくる
      var KeywordList = String(Values[i][3]).split(",");
      KeywordList.unshift(String(Values[i][1]));
      
      for(var l = 0; l<andList.length; l++){
        for(var h = 0; h<KeywordList.length; h++){
          //判定
          if(String(KeywordList[h]).indexOf(andList[l])>-1){
            //単一検索のとき
            if(andList.length ==1){
              Answer.push(i);  
              var Res = Answer.filter(function (x, y, self) {
                return self.indexOf(x) === y;});              
             //And検索のとき
            }else{
              var Res = Answer.filter(function (x, y, self) {
                return self.indexOf(x) === y;});
              matchList.push(i);
              Answer = matchList.filter(function (e, f, self) {
                return self.indexOf(e) === f && f !== self.lastIndexOf(e); });
            }
          }
        }
      }
      continue;
    }
    
    //配列の重複を削除(同じ項目に含まれる複数のキーワードがヒットしたとき用,表示項目が重複したとき用)
    var messageAnswer = Answer.filter(function (x, y, self) {
      return self.indexOf(x) === y;});
    
    //メッセージ処理
    count = messageAnswer.length;   
    message = message + count +"件"
    if(count >10){
      message = message + "\n" +"検索結果をIDで表示します";
      for(var q =0; q< messageAnswer.length; q++){
        var j = messageAnswer[q];
        message = message + "\n"+ String(Values[j][0]) + "\t" + String(Values[j][1]);
      }
    }else if(count < 1){
      message = message;
    }else{
      
      for(var q =0; q< messageAnswer.length; q++){
        var j = messageAnswer[q];
        //message = message + "\n" + String(Values[j][1])+ "\n" + String(Values[j][2]);}
        //代替テキストリンク(蛇足)
        message = message + "\n" + "<" + String(Values[j][2]) + "|" + String(Values[j][1]) + ">";}
    }
  }
  return message;
}