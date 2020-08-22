const fs = require("fs");
// variables
const dataPath = "./data/albums.json";

// helper methods
const readFile = (
  callback,
  returnJson = false,
  filePath = dataPath,
  encoding = "utf8"
) => {
  fs.readFile(filePath, encoding, (err, data) => {
    if (err) {
      console.log(err);
    }
    callback(returnJson ? JSON.parse(data) : data);
  });
};

const writeFile = (
  fileData,
  callback,
  filePath = dataPath,
  encoding = "utf8"
) => {
  fs.writeFile(filePath, fileData, encoding, (err) => {
    if (err) {
      console.log(err);
    }
    callback();
  });
};

module.exports = {
  // read - GET http://localhost:3001/albums
  getAllAlbums: function (req, res) {
    readFile((data) => {
      var values = JSON.parse(data);
      res.send(values);
    });
  },

  // read - GET http://localhost:3001/albums/{albumId}
  getAlbum: function (req, res) {
    readFile((data) => {
      var values = JSON.parse(data);
      if(values[req.params.id] == undefined){
        res.send("This Album does not exist.");
      }
      res.send(values[req.params.id]);
    });
  },

  // create new photo - POST http://localhost:3001/albums/{albumId}
  createPhoto: function (req, res) {
    readFile((data) => {
      var values = JSON.parse(data);
      var pictureName = req.body.name;
      var photographerName = req.body.photographer;
      var pictureUrl = req.body.link;
      if (pictureName == undefined || pictureName.trim() == "") {
        res.send("Must enter a Picture Name.");
        return;
      }
      if (photographerName == undefined || photographerName.trim() == "") {
        res.send("Must enter a Photographer Name.");
        return;
      }
      if(!isValidURL(pictureUrl)){
        res.send("Url Must be Valid.");
        return;
      }
      var album = values[req.params.id];
      if(album == undefined){
        res.send("This Album does not exist.");
        return;
      }
      var pictures = album["pictures"];
      var id = 100;
      while (pictures[id] != undefined) {
        id++;
      }
      pictures[id] = req.body;
      pictures[id].id = id + "";
      if (pictures[req.body.id] == undefined) {
        return res.send("Error, the photo did not get an ID.");
      }
      writeFile(JSON.stringify(values, null, 2), () => {
        res.status(200).send("New photo added to album.");
      });
    });
  },

  // delete album - DELETE http://localhost:3001/albums/{albumId}
  deleteAlbum: function (req, res) {
    readFile((data) => {
      var values = JSON.parse(data);
      if (values[req.params.id] != undefined) {
        delete values[req.params.id];
        writeFile(JSON.stringify(values, null, 2), () => {
          res.status(200).send("Album " + req.params.id + " has deleted.");
        });
      } else {
        res.send("Error, this album does not exist");
      }
    });
  },

  // create new album - POST http://localhost:3001/albums
  createAlbum: function (req, res) {
    readFile((data) => {
      var values = JSON.parse(data);
      var AlbumName = req.body.name;
      var albumType = req.body.type;
      var picturesVal = req.body.pictures;

      if (AlbumName == undefined) {
        res.send("Must enter an Album Name.");
        return;
      }
      if (albumType != "People" && albumType != "Nature") {
        res.send("Album Type must be type of Nature or People.");
        return;
      }
      var id = 1;
      while (values[id] != undefined) {
        id++;
      }
      values[id] = req.body;
      if (picturesVal == undefined) {
        var album = values[id];
        album["pictures"] = {};
      }
      writeFile(JSON.stringify(values, null, 2), () => {
        res.status(200).send("New album has created.");
      });
    });
  },
};

function isValidURL(urlLink) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(urlLink);
}
