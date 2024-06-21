function LeadsQuery() {
  let endpointUrl = "https://ic-egypt.aiesec.org.eg/graphql"; // Replace with your GraphQL endpoint URL

  let payload_auth = {
    query: `
            mutation {
                login(username: "", password: "") {
                    token
                }
            }
        `,
  };

  let payload = {
    query: `
            query AllLeads {
    allLeads(perPage: 1000) {
        id
        createdAt
        firstName
        lastName
        nickName
        aiesecEmail
        personalEmail
        whatsappNumber
        telegramUsername
        position
        generation
        otherRoles
        entity
        region
        dateOfBirth
        gender
        pictureOfTheDelegate
        shirtSize
        nameAsPerPassport
        natonality
        currentLivingCountryTerritory
        passportScannedPhoto
        passportIssueDate
        passportExpiryDate
        visaSupport
        academicBackground
        partnersTopics
        howToMakePartnersSpacesRelevant
        globalPartnerForKeyNote
        whatDoYouWantToKnowAboutPartners
        careerConfidence
        workExperience
        partnersForCareer
        whyThisGlobalPartner
        engagements
        roomPreference
        food
        allergies
        preAndPostTrips
        merchandise
        egyptianNightsExpectations
        ccTeamExpecations
        logisticalExpectations
        agendaExpectations
    }
}

        `,
  };

  let options_auth = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload_auth),
  };

  var response_auth = UrlFetchApp.fetch(endpointUrl, options_auth);
  var responseData_auth = JSON.parse(response_auth.getContentText());

  let token = "JWT " + responseData_auth["data"]["login"]["token"];

  let options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    headers: {
      Authorization: token,
    },
  };

  var response = UrlFetchApp.fetch(endpointUrl, options);
  var responseData = JSON.parse(response.getContentText());

  return responseData.data.allLeads;
}

function convertUTCtoLocalTimeZone(utcDateString) {
  var utcDate = new Date(utcDateString);
  var gmtDate = Utilities.formatDate(
    utcDate,
    Session.getScriptTimeZone(),
    "yyyy-MM-dd HH:mm:ss"
  );
  return gmtDate;
}

function LeadsUpdating() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Leads");
  sheet.getLastRow();
  let rows = [];
  let dataSet = LeadsQuery();
  let ids = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues().flat(1);
  // Logger.log(dataSet)
  for (var i = 0; i < dataSet.length; i++) {
    var gmtCreatedAt = convertUTCtoLocalTimeZone(dataSet[i].createdAt);

    if (ids.indexOf(dataSet[i].id) > -1) {
      var row = [];
      row.push([
        dataSet[i].id,
        gmtCreatedAt,
        dataSet[i].firstName,
        dataSet[i].lastName,
        dataSet[i].nickName,
        dataSet[i].aiesecEmail,
        dataSet[i].personalEmail,
        dataSet[i].whatsappNumber,
        dataSet[i].telegramUsername,
        dataSet[i].position,
        dataSet[i].generation,
        dataSet[i].otherRoles,
        dataSet[i].entity,
        dataSet[i].region,
        dataSet[i].dateOfBirth,
        dataSet[i].gender,
        "https://ic-space.fra1.cdn.digitaloceanspaces.com/ic-space/" +
          dataSet[i].pictureOfTheDelegate,
        dataSet[i].shirtSize,
        dataSet[i].nameAsPerPassport,
        dataSet[i].natonality,
        dataSet[i].currentLivingCountryTerritory,
        "https://ic-space.fra1.cdn.digitaloceanspaces.com/ic-space/" +
          dataSet[i].passportScannedPhoto,
        dataSet[i].passportIssueDate,
        dataSet[i].passportExpiryDate,
        dataSet[i].visaSupport,
        dataSet[i].academicBackground,
        dataSet[i].partnersTopics,
        dataSet[i].howToMakePartnersSpacesRelevant,
        dataSet[i].globalPartnerForKeyNote,
        dataSet[i].whatDoYouWantToKnowAboutPartners,
        dataSet[i].careerConfidence,
        dataSet[i].workExperience,
        dataSet[i].partnersForCareer,
        dataSet[i].whyThisGlobalPartner,
        dataSet[i].engagements,
        dataSet[i].roomPreference,
        dataSet[i].food.join(", "),
        dataSet[i].allergies,
        dataSet[i].preAndPostTrips,
        dataSet[i].merchandise,
        dataSet[i].egyptianNightsExpectations,
        dataSet[i].ccTeamExpecations,
        dataSet[i].logisticalExpectations,
        dataSet[i].agendaExpectations,
      ]);
      Logger.log(row);
      var index = ids.indexOf(dataSet[i].id) + 1;
      if (index > 89) {
        sheet.getRange(index, 1, 1, row[0].length).setValues(row);
      }
    } else {
      console.log(i);
      console.log("new");
      rows.push([
        dataSet[i].id,
        gmtCreatedAt,
        dataSet[i].firstName,
        dataSet[i].lastName,
        dataSet[i].nickName,
        dataSet[i].aiesecEmail,
        dataSet[i].personalEmail,
        dataSet[i].whatsappNumber,
        dataSet[i].telegramUsername,
        dataSet[i].position,
        dataSet[i].generation,
        dataSet[i].otherRoles,
        dataSet[i].entity,
        dataSet[i].region,
        dataSet[i].dateOfBirth,
        dataSet[i].gender,
        "https://ic-space.fra1.cdn.digitaloceanspaces.com/ic-space/" +
          dataSet[i].pictureOfTheDelegate,
        dataSet[i].shirtSize,
        dataSet[i].nameAsPerPassport,
        dataSet[i].natonality,
        dataSet[i].currentLivingCountryTerritory,
        "https://ic-space.fra1.cdn.digitaloceanspaces.com/ic-space/" +
          dataSet[i].passportScannedPhoto,
        dataSet[i].passportIssueDate,
        dataSet[i].passportExpiryDate,
        dataSet[i].visaSupport,
        dataSet[i].academicBackground,
        dataSet[i].partnersTopics,
        dataSet[i].howToMakePartnersSpacesRelevant,
        dataSet[i].globalPartnerForKeyNote,
        dataSet[i].whatDoYouWantToKnowAboutPartners,
        dataSet[i].careerConfidence,
        dataSet[i].workExperience,
        dataSet[i].partnersForCareer,
        dataSet[i].whyThisGlobalPartner,
        dataSet[i].engagements,
        dataSet[i].roomPreference,
        dataSet[i].food.join(", "),
        dataSet[i].allergies,
        dataSet[i].preAndPostTrips,
        dataSet[i].merchandise,
        dataSet[i].egyptianNightsExpectations,
        dataSet[i].ccTeamExpecations,
        dataSet[i].logisticalExpectations,
        dataSet[i].agendaExpectations,
      ]);
    }
  }
  if (rows.length > 0) {
    sheet
      .getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length)
      .setValues(rows);
  }
}
