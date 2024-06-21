function MerchQuery() {
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
           query AllOrderItems {
    allOrderItems(page: 1, perPage: 1000) {
        order {
            user {
                email
            }
            createdAt
        }
        product {
            name
            price
            productType
        }
        quantity
        id
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

  return responseData.data.allOrderItems;
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

function MerchUpdating() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("Merch");
  sheet.getLastRow();
  let rows = [];
  let dataSet = MerchQuery();
  let ids = sheet.getRange(2, 1, sheet.getLastRow(), 1).getValues().flat(1);
  Logger.log(ids);
  // Logger.log(dataSet)
  for (var i = 0; i < dataSet.length; i++) {
    var gmtCreatedAt = convertUTCtoLocalTimeZone(dataSet[i].order.createdAt);

    if (ids.indexOf(Math.floor(dataSet[i].id)) > -1) {
      var row = [];
      row.push([
        dataSet[i].id,
        gmtCreatedAt,
        dataSet[i].order.user.email,
        dataSet[i].product.name,
        dataSet[i].product.price + "€",
        dataSet[i].quantity,
        dataSet[i].product.productType,
      ]);
      Logger.log(row);
      sheet
        .getRange(
          ids.indexOf(Math.floor(dataSet[i].id)) + 2,
          1,
          1,
          row[0].length
        )
        .setValues(row);
    } else {
      console.log(i);
      console.log("new");
      rows.push([
        dataSet[i].id,
        gmtCreatedAt,
        dataSet[i].order.user.email,
        dataSet[i].product.name,
        dataSet[i].product.price + "€",
        dataSet[i].quantity,
        dataSet[i].product.productType,
      ]);
    }
  }
  if (rows.length > 0) {
    sheet
      .getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length)
      .setValues(rows);
  }
}
