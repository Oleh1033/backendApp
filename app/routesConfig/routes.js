const rout = require("../../config/endpoints");
const billennium = "billennium";

module.exports = function (app, dbCompany) {
  app.post(`${rout.api}${rout.company}${rout.users}`, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const newUsers = req.body.users;
    const user = newUsers;

    dbCompany.findOneAndUpdate(
      { company: billennium },
      { $set: { usersArray: user } },
      function (err, result) {
        if (err) {
          return console.log(err);
        }
      }
    );
  });

  app.get(`${rout.api}${rout.company}${rout.values}`, function (req, res) {
    dbCompany
      .find({ company: billennium })
      .project({ _id: 0, valueCompany: true })
      .toArray(function (err, list) {
        res.send(list[0].valueCompany);
      });
  });

  app.get(`${rout.api}${rout.company}${rout.users}`, function (req, res) {
    dbCompany
      .find({ company: billennium })
      .project({ _id: 0, usersArray: true })
      .toArray(function (err, list) {
        res.send(list[0].usersArray);
      });
  });

  function filterArray(values, list) {
    let result = list.filter(i => {
      return i.displayName.toLowerCase().indexOf(values.toLowerCase()) + 1;
    });

    return result;
  }

  app.post(`${rout.api}${rout.company}${rout.users}${rout.filter}`, function (req, res) {
    dbCompany
      .find({ company: billennium })
      .project({ _id: 0, usersArray: true })
      .toArray(function (err, list) {
        let test = req.body.name;
        if (test) {
          res.send(filterArray(req.body.name, list[0].usersArray))
        };
        if (!test) {
          res.send([])
        };
      });
  });

  app.post(`${rout.api}${rout.company}${rout.users}`, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    const newUsers = req.body.users;
    const user = newUsers;

    dbCompany.findOneAndUpdate(
      { company: billennium },
      { $set: { usersArray: user } },
      function (err, result) {
        if (err) {
          return console.log(err)
        };
      }
    );
  });

  app.post(`${rout.api}${rout.company}`, function (req, res) {
    if (!req.body) {
      return res.sendStatus(400)
    }

    const companyName = req.body.company;
    const companyValue = req.body.value;
    const usersList = req.body.users;

    const user = {
      company: companyName,
      valueCompany: companyValue,
      usersArray: usersList
    };

    dbCompany.insertOne(user, function (err, result) {
      res.send(user);
    });
  });
};
