const express = require("express");

const leaderRouter = express.Router();

leaderRouter
  .route("/")
  .get((req, res) => {
    res.status(200).send("will send the leader to you");
  })
  .post((req, res) => {
    res.send(
      `will add the leader :${req.body.name} with detail ${req.body.desc}`
    );
  })
  .put((req, res) => {
    res.status(403).send("cant add items to leader");
  })
  .delete((req, res) => {
    res.send("delete all leader");
  });

leaderRouter
  .route("/:leaderId")
  .get((req, res) => {
    res.status(200).send(`will send the leader of id: ${req.params.leaderId}`);
  })
  .post((req, res) => {
    res.send(`cant add items to leader/${req.params.leaderId}`);
  })
  .put((req, res) => {
    res
      .status(403)
      .send(
        `will add the leader :${req.body.name} with detail ${req.body.desc} to id: ${req.params.leaderId}`
      );
  })
  .delete((req, res) => {
    res.send(`delete  leader with id: ${req.params.leaderId}`);
  });

module.exports = leaderRouter;
