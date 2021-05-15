const express = require("express");

const promoRouter = express.Router();

promoRouter
  .route("/")
  .get((req, res) => {
    res.status(200).send("will send the promotions to you");
  })
  .post((req, res) => {
    res.send(
      `will add the promotion :${req.body.name} with detail ${req.body.desc}`
    );
  })
  .put((req, res) => {
    res.status(403).send("cant add items to promotions");
  })
  .delete((req, res) => {
    res.send("delete all promotion");
  });

promoRouter
  .route("/:promoId")
  .get((req, res) => {
    res
      .status(200)
      .send(`will send the promotions of id: ${req.params.promoId}`);
  })
  .post((req, res) => {
    res.send(`cant add items to promotions/${req.params.promoId}`);
  })
  .put((req, res) => {
    res
      .status(403)
      .send(
        `will add the promotion :${req.body.name} with detail ${req.body.desc} to id: ${req.params.promoId}`
      );
  })
  .delete((req, res) => {
    res.send(`delete  promotion with id: ${req.params.promoId}`);
  });

module.exports = promoRouter;
