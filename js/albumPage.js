function loadAlbumList() {
  $.ajax({
    url: "http://localhost:3001/albums",
    success: function (data) {
      var albumsList = [];
      $.each(data, function (index, entry) {
        var albumArr = [];
        albumArr.push(index);
        albumArr.push(entry.name);
        albumArr.push(entry.type);
        albumsList.push(albumArr);
      });
      createAlbumList(albumsList);
    },
    error: function () {
      $("#error-space").replaceWith(
        `<div id="error-space">Error, failed to load the Album list</div>`
      );
    },
  });
}

function createAlbumList(albumsList) {
  let AlbumsTableList = `
            <table class="table table-striped table-dark" style="width:85%">
                 <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col" class="rowName">Album Name:</th>
                        <th scope="col" class="rowType">Album Type:</th>
                        <th scope="col">Links:</th>
                      </tr>
                 </thead>
                <tbody>`;
  for (i = 0; i < albumsList.length; i++) {
    AlbumsTableList += `<tr>
                    <th scope="row">${i + 1}</th>
                    <td class="rowName">${albumsList[i][1]}</td>
                    <td class="rowType">${albumsList[i][2]}</td>
                    <td><div id="editBtm">
                    <button id="${albumsList[i][1]}" type="button" class="btn btn-secondary btn-sm buttonDesign" data-toggle="modal" data-target="#pictureModal" onClick="loadPicturesList(${albumsList[i][0]})">View Pictures List</button>
                    <button id="${albumsList[i][1]}" type="button" class="btn btn-secondary btn-sm buttonDesign" data-toggle="modal" data-target="#pictureModalPreview" onClick="addPictures(${albumsList[i][0]})">Add Picture</button>
                    <button id="${albumsList[i][1]}" type="button" class="btn btn-secondary btn-sm buttonDesign" onClick="deleteAlbum(${albumsList[i][0]}, id)">Delete Album</button></td></div></tr>`;}AlbumsTableList += ` </tbody></table>
  <div id="createAlbum"><button id="createAlbumBtm" type="button" class="btn btn-secondary btn-lg buttonDesignCreate" data-toggle="modal" data-target="#albumModalPreview" onClick="createAlbum()">CreateAlbum</button></div>`;
  $("#albumListSec").replaceWith(
    `<div id="albumListSec">${AlbumsTableList}</div>`
  );
}

function loadPicturesList(id) {
  $.ajax({
    url: "http://localhost:3001/albums/" + id,
    success: function (data) {
      var pictureList = [];
      $.each(data["pictures"], function (picIndex, picEntry) {
        var picture = [];
        picture.push(picEntry.name);
        picture.push(picEntry.link);
        picture.push(picEntry.photographer);
        picture.push(picEntry.id);
        pictureList.push(picture);
      });
      viewPictures(pictureList, data.name);
    },
    error: function () {
      $("#error-space").replaceWith(
        `<div id="error-space">Error, failed to load the Picture list</div>`
      );
    },
  });
}

function viewPictures(pictureList, albumName) {
  let albumNameTitle = `<div id="picTitleModal"><h5 class="modal-title" id="exampleModalLabel">${albumName}</h5></div>`;
  $("#picTitleModal").replaceWith(
    `<div id="picTitleModal">${albumNameTitle}</div>`
  );
  let pictureListView = `<div id="caruselSize">
  <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
    <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
    <div class="carousel-inner">`;
  if (pictureList.length == 0) {
    $("#picture-list").replaceWith(
      `<div id="picture-list"><div id="no-picture">There is no Pictures in this Album.</div></div>`
    );
  } else {
    for (let i = 0; i < pictureList.length; i++) {
      if (i == 0) {
        pictureListView += `
    <div class="carousel-item active">
            <div class="image-container">
              <img class="d-block w-100" src="${pictureList[i][1]}" class="image-design">
              <div class="title-space">Picture Name: ${pictureList[i][0]}<br>Photographer Name: ${pictureList[i][2]}</div>
            </div>
          </div>`;
      } else {
        pictureListView += `
    <div class="carousel-item">
            <div class="image-container">
              <img class="d-block w-100" src="${pictureList[i][1]}" class="image-design">
              <div class="title-space">Picture Name: ${pictureList[i][0]}<br>Photographer Name: ${pictureList[i][2]}</div>
            </div>
          </div>`;
      }
    }

    pictureListView += `</div></div></div>`;

    $("#picture-list").replaceWith(
      `<div id="picture-list">${pictureListView}</div>`
    );
    startCarouselAuto();
  }
}

function addPictures(id) {
  $("form[name='picture_form']").validate({
    rules: {
      picture_name: {
        required: true,
        minlength: 1,
      },
      photographer_name: {
        required: true,
        minlength: 1,
      },
    },
    messages: {},
  });
  $("#picture_form").submit(function (event) {
    if (!$("#picture_form").valid()) return;
    $.ajax({
      type: "POST", // define the type of HTTP verb we want to use (POST for our form)
      url: "http://localhost:3001/albums/" + id, // the url where we want to POST
      contentType: "application/json",
      data: JSON.stringify({
        name: $("#picture_name").val(),
        photographer: $("#photographer_name").val(),
        link: $("#url_link").val(),
        id: "",
      }),
      processData: false,
      encode: true,
      success: function (data, textStatus, jQxhr) {
        $("#pictureModalPreview").modal("hide");
        location.reload();
      },
      error: function (jqXhr, textStatus, errorThrown) {
        $("#pictureModalPreview").modal("hide");
        $("#error-space").replaceWith(
          `<div id="error-space">Error, failed to add the Photo</div>`
        );
      },
    });
    event.preventDefault();
  });
}

function createAlbum() {
  $("form[name='album_form']").validate({
    rules: {
      picture_name: {
        required: true,
        minlength: 1,
      },
      album_type: {
        required: true,
        minlength: 1,
      },
    },
    messages: {},
  });
  $("#album_form").submit(function (event) {
    if (!$("#album_form").valid()) return;
    $.ajax({
      type: "POST", // define the type of HTTP verb we want to use (POST for our form)
      url: "http://localhost:3001/albums", // the url where we want to POST
      contentType: "application/json",
      data: JSON.stringify({
        name: $("#album_name").val(),
        type: $("#album_type").val(),
        pictures: {},
      }),
      processData: false,
      encode: true,
      success: function (data, textStatus, jQxhr) {
        $("#albumModalPreview").modal("hide");
        location.reload();
      },
      error: function (jqXhr, textStatus, errorThrown) {
        $("#albumModalPreview").modal("hide");
        $("#error-space").replaceWith(
          `<div id="error-space">Error, failed to add the Album</div>`
        );
      },
    });
    event.preventDefault();
  });
}

function deleteAlbum(id, albumName) {
  bootbox.confirm({
    title: "Delete Album?",
    message: "Are you sure you want to delete <b>" + albumName+ "</b> album?",
    buttons: {
      cancel: {
        label: '<i class="fa fa-times"></i> Cancel',
      },
      confirm: {
        label: '<i class="fa fa-check"></i> Confirm',
      },
    },
    callback: function (result) {
      if (result) {
        $.ajax({
          url: "http://localhost:3001/albums/" + id,
          type: "DELETE",
          success: function (data) {
            location.reload();
          },
          error: function () {
            $("#error-space").replaceWith(
              `<div id="error-space">Error, failed to delete the Album</div>`
            );
          },
        });
      }
    },
  });
}

function startCarouselAuto() {
  setTimeout(function () {
    $("#carouselExampleIndicators")
      .carousel({
        interval: 2200,
        cycle: true,
      })
      .trigger("slide");
  }, 2000);
}

function loadPictureForm() {
  $("#PictureForm").load("http://localhost:3001/add_picture");
}

function loadAlbumForm() {
  $("#AlbumForm").load("http://localhost:3001/create_album");
}

onLoad = function () {
  loadAlbumList();
  loadPictureForm();
  loadAlbumForm();
};

$("document").ready(onLoad);
