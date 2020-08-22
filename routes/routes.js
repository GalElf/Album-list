const express = require("express"),
  fs = require("fs"),
  albumRoutes = require("./albums");

var router = express.Router();

router.get("/albums", albumRoutes.getAllAlbums);
router.get("/albums/:id", albumRoutes.getAlbum);
router.post("/albums/:id", albumRoutes.createPhoto);
router.delete("/albums/:id", albumRoutes.deleteAlbum);
router.post("/albums", albumRoutes.createAlbum);

module.exports = router;