var FOLDER = '0B7HFAtB1-yVpVVhBQVVEN09fOE0';
var RESUME = '0B7HFAtB1-yVpbXY5TTNNNXpUV1k';
var COVERTEMPLATE = '0B7HFAtB1-yVpU3NoTWFPTkVmZ2M';

function bulkSend() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var currentDate = new Date();
  for (var i = 1; i < data.length; i++) {
    if (data[i][3] === 0 && isValidTime(currentDate.getHours()) ) {
      var dataHash = rowHashify(data[i]);
      //send email
      //sendCompanyEmail(data[i]);
      if (dataHash['useEmailAddress'] === 1) {
        sendCompanyEmail(dataHash);
        Logger.log("email sent to: " + dataHash['recipient'] + "for company " + dataHash['companyName'] );
      } else if (dataHash['useEmailAddress'] === 0) {
        saveCoverLetter(dataHash);
      }
        
      //change cell from 0 to 1 to indicate that the company has been emailed
      SpreadsheetApp.getActiveSheet().getRange("D" + (i+1)).setValue("1");
      //stop execution: 
      i = 10000000000;
    } else {
      //don't send email to company you've emailed
    }
  }
}

//this function will ensure an email is sent at 8 AM and then every hour until 9 PM 
function isValidTime(hour) {
return true;
  if (hour > 7 && hour < 22) {
  	return true;
  } else {
    //return true;
    return false;
  }
}

function sendCompanyEmail(dataHash) {
  var subject = createEmailSubject(dataHash);
  var body = createEmailBody(dataHash);
  var resume = DriveApp.getFileById(RESUME);
  MailApp.sendEmail({
    to: dataHash['recipient'], 
    subject: createEmailSubject(dataHash), 
    htmlBody: body,
    attachments: [resume.getAs(MimeType.PDF)]
  });
}

function createEmailSubject(dataHash) {
  //parse job title
  var jobTitle = dataHash['jobTitle'] || "JS/Rails Web Developer";
  var companyCity = dataHash['companyCity'];
  return(jobTitle + " - " + companyCity);
}

function createEmailBody(dataHash) {
  
  var template = getCoverTemplate();
  //replace current date
  template = template.replace('{currentdate}', stringifiedCurrentDate());
  //replace company name
  template = template.replace('{company_name}', dataHash['companyName']);
  //replace company-specific blurb
  template = template.replace('{blurb_about_company}', dataHash['companyBlurb']);
  
  return(template);
}

function saveCoverLetter(dataHash) {
  var folder = DriveApp.getFolderById(FOLDER);
  folder.createFile(dataHash['companyName'] + ' ' + dataHash['jobTitle'] + '.html', createEmailBody(dataHash));
}

function getCoverTemplate() {
  return("<!DOCTYPE html PUBLIC '-//W3C//DTD HTML 4.0 Transitional//EN' 'http://www.w3.org/TR/REC-html40/loose.dtd'><html><head><title>Cover_Copy</title><meta content='text/html; charset=UTF-8' http-equiv='content-type'></head><body class='c8' style='max-width: 468pt; background-color: #ffffff;' bgcolor='#ffffff'><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1 c4' style='font-size: 36pt; font-family: Helvetica Neue;'>Joseph Combs</span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c0' style='color: #1155cc; font-size: 9pt; font-family: Helvetica Neue; text-decoration: underline;'><a class='c3' href='mailto:joseph.e.combs@gmail.com' style='color: inherit; text-decoration: inherit;'>joseph.e.combs@gmail.com</a></span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c6 c1' style='font-size: 9pt; font-family: Helvetica Neue;'>585-319-1067</span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c0' style='color: #1155cc; font-size: 9pt; font-family: Helvetica Neue; text-decoration: underline;'><a class='c3' href='http://www.josephecombs.com' style='color: inherit; text-decoration: inherit;'>www.josephecombs.com</a></span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c0' style='color: #1155cc; font-size: 9pt; font-family: Helvetica Neue; text-decoration: underline;'><a class='c3' href='http://www.github.com/josephecombs' style='color: inherit; text-decoration: inherit;'>Github</a></span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c0' style='color: #1155cc; font-size: 9pt; font-family: Helvetica Neue; text-decoration: underline;'><a class='c3' href='http://www.linkedin.com/pub/joseph-combs/21/275/906' style='color: inherit; text-decoration: inherit;'>Linkedin</a></span></p><p class='c2 c5' style='widows: 2; orphans: 2; direction: ltr; height: 11pt; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'></span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'>{currentdate}</span><span class='c1' style='font-family: Helvetica Neue;'>,</span></p><p class='c2 c5' style='widows: 2; orphans: 2; direction: ltr; height: 11pt; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'></span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'>Dear {company_name},</span></p><p class='c2 c5' style='widows: 2; orphans: 2; direction: ltr; height: 11pt; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'></span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'>I am a web developer with experience building web applications with with Ruby on Rails and JavaScript.  I also have significant operations experience working with AWS, networking, database administration, and end user support in both *nix and Microsoft environments.</span></p><p class='c2 c5' style='widows: 2; orphans: 2; direction: ltr; height: 11pt; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'></span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'>I recently honed my skills in Ruby, Ruby on Rails, JavaScript, and Backbone.js at </span><span class='c7 c1' style='color: #1155cc; text-decoration: underline; font-family: Helvetica Neue;'><a class='c3' href='http://www.appacademy.io' style='color: inherit; text-decoration: inherit;'>App Academy</a></span><span class='c1' style='font-family: Helvetica Neue;'>, an extremely rigorous and selective bootcamp in San Francisco.  My </span><span class='c7 c1' style='color: #1155cc; text-decoration: underline; font-family: Helvetica Neue;'><a class='c3' href='http://www.queueskipper.com' style='color: inherit; text-decoration: inherit;'>final project</a></span><span class='c1' style='font-family: Helvetica Neue;'> was a simple listings and booking webapp modeled on AirBnB but driven completely by the user’s location.  The solution uses Rails for authentication and database API handling, Backbone.js for everything else, and an implementation of the Google Maps JS API to render and create listings.</span></p><p class='c2 c5' style='widows: 2; orphans: 2; direction: ltr; height: 11pt; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'></span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'>{blurb_about_company}</span></p><p class='c2 c5' style='widows: 2; orphans: 2; direction: ltr; height: 11pt; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'></span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'>I have a record of quickly learning new technologies.  Most technical line-items on my </span><span class='c1 c7' style='color: #1155cc; text-decoration: underline; font-family: Helvetica Neue;'><a class='c3' href='http://www.josephecombs.com/pages/Joseph_Combs_Resume.pdf' style='color: inherit; text-decoration: inherit;'>CV</a></span><span class='c1' style='font-family: Helvetica Neue;'> (attached) were won through self-teaching or on-the-job learning.  I would embrace the chance to learn the complexity of your business problems and add simplicity and value.</span></p><p class='c2 c5' style='widows: 2; orphans: 2; direction: ltr; height: 11pt; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'></span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'>I previously earned a degree in Economics from Georgetown University in 2010 but I realized that developing software would be more fun.  It has been great so far, and I look forward to being on a team who finds their work challenging and fun.</span></p><p class='c2 c5' style='widows: 2; orphans: 2; direction: ltr; height: 11pt; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'></span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'>All my best,</span></p><p class='c2' style='widows: 2; orphans: 2; direction: ltr; color: #000000; font-size: 11pt; font-family: Arial; margin: 0;'><span class='c1' style='font-family: Helvetica Neue;'>Joe</span></p></body></html>");
}

function rowHashify(dataRow) {
  var dataHash = {};
  
  dataHash['companyName'] = dataRow[0];
  dataHash['recipient'] = dataRow[2];
  dataHash['emailState'] = dataRow[3];
  dataHash['jobTitle'] = dataRow[6];
  dataHash['companyBlurb'] = dataRow[7];
  dataHash['companyCity'] = dataRow[8];
  dataHash['useEmailAddress'] = dataRow[10];
  
  return(dataHash);
}

function stringifiedCurrentDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  
  if(dd<10) {
      dd='0'+dd;
  } 
  
  if(mm<10) {
      mm='0'+mm;
  } 
  
  today = mm + '/' + dd + '/' + yyyy;
  return today;
}