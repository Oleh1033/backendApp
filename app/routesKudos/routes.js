const rout = require("../../config/endpoints");

const request = require("request-promise");
const id =  require("../../config/idBillennium");

idBillennium = id.idBillennium;

module.exports = function (app, dbKudos) {
  const urlUserData = "https://graph.microsoft.com/v1.0/me";
  const options = {
    method: "GET",
    uri: "https://graph.microsoft.com/v1.0/organization?$select=id,displayName",
    json: true,
    headers: {
      "Content-Type": "application/json",
      Authorization: ''
    }
  };

  app.get(`${rout.api}${rout.kudos}`, function (req, res) {
    let token = req.headers.token;

    if (token === undefined) {
      return res.sendStatus(401);
    }

    options.headers.Authorization = token;
    request(options).then(function (response) {
      console.log(response);
      var idCompanyUser = response.value[0].id;
      if (idBillennium === idCompanyUser) {
        isAuthenticated = true;
        dbKudos
          .find({})
          .sort([["date", -1]])
          .toArray(function (err, kudos) {
            res.send(kudos);
          });
      }
    });
  });

  app.post(`${rout.api}${rout.kudos}${rout.my}`, function (req, res) {
    let token = req.headers.token;

    if (token === undefined) {
      return res.sendStatus(401);
    }
    options.headers.Authorization = token;
    request(options).then(function (response) {
      var idCompanyUser = response.value[0].id;
      if (idBillennium === idCompanyUser) {
        options.uri = urlUserData;
        request(options).then(function(responseTwo) {
          dbKudos
          .find({ to: responseTwo.displayName })
          .sort([["date", -1]])
          .toArray(function (err, kudos) {
            res.send(kudos);
          })
        })
      }
    });
  });

  app.post(`${rout.api}${rout.kudos}`, function (req, res) {
    if (!req.body) {
      return res.sendStatus(400);
    }

    let token = req.headers.token;
    if (token === undefined) {
      return res.sendStatus(401);
    }

    options.headers.Authorization = token;
    request(options).then(function (response) {
      var idCompanyUser = response.value[0].id;
      if (idBillennium === idCompanyUser) {

        options.uri = urlUserData;
        
        request(options).then(function(responseTwo) {

          const idFrom = responseTwo.id;
          const kudosFrom = responseTwo.displayName;
          const kudosTo = req.body.to;
          const kudosDate = new Date();
          const kudosMessage = req.body.message;
          const emailTo = req.body.emailTo;
          const kudosValue = req.body.value;
          const idTo = req.body.idTo;
          const jobTitle = req.body.jobTitle;
  
          const user = {
            value: kudosValue,
            from: kudosFrom,
            to: kudosTo,
            date: kudosDate,
            message: kudosMessage,
            emailTo: emailTo,
            idFrom: idFrom,
            idTo: idTo,
            jobTitle: jobTitle
          };
  
          dbKudos.insertOne(user, function (err, result) {
            res.send(user);
          });
        })
      }
    });
  });
};
