<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uploadDir = 'images/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $uploadedFile = $_FILES['fileInput'];
    $extension = pathinfo($uploadedFile['name'], PATHINFO_EXTENSION);
    $newFileName = uniqid('image_') . '.' . $extension;
    $targetFilePath = $uploadDir . $newFileName;

    if (move_uploaded_file($uploadedFile['tmp_name'], $targetFilePath)) {
        $response = ['imageUrl' => 'http://yourdomain.com/' . $targetFilePath];
        echo json_encode($response);
    } else {
        echo json_encode(['error' => 'Failed to upload the image.']);
    }
    exit;
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image Generator</title>
  <style>
    /* Add your styles for a visually appealing design */
  </style>
</head>
<body>

  <button onclick="sendAlert()">Alert</button>
  <button onclick="selectImage()">Select Image</button>
  <button onclick="sendImage()">Send Image</button>

  <br>

  <form id="imageForm" enctype="multipart/form-data">
    <input type="file" name="fileInput" id="fileInput" onchange="handleFileSelect(event)" style="display: none;" />
  </form>

  <br>
  <img id="imagePreview" src="" alt="Image Preview">

  <script>
    function sendAlert() {
      const webhookUrl = "https://discord.com/api/webhooks/1210738712661590026/RQ3IlAllPU3XSmyiM7GySyIPtpPnu2vB3A9I3_ElyHkh0R0FkV-LimusIKk-pbntjz51";
      const message = "**Your Image Is Being Generated…**";

      const request = new XMLHttpRequest();
      request.open("POST", webhookUrl);
      request.setRequestHeader('Content-type', 'application/json');

      const myEmbed = {
        author: {
          name: ""
        },
        title: "",
        description: message,
        color: hexToDecimal("#000080")
      };

      const params = {
        username: "Vaultune AI",
        embeds: [myEmbed]
      };

      request.send(JSON.stringify(params));
    }

    function sendImage() {
      const webhookUrl = "https://discord.com/api/webhooks/1210738712661590026/RQ3IlAllPU3XSmyiM7GySyIPtpPnu2vB3A9I3_ElyHkh0R0FkV-LimusIKk-pbntjz51";

      const request = new XMLHttpRequest();
      request.open("POST", webhookUrl);
      request.setRequestHeader('Content-type', 'application/json');

      const formData = new FormData(document.getElementById('imageForm'));

      fetch('', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        const imageUrl = data.imageUrl;
        
        const myEmbed = {
          author: {
            name: ""
          },
          title: "",
          image: {
            url: imageUrl
          },
          color: hexToDecimal("#000080")
        };

        const params = {
          username: "Vaultune AI",
          embeds: [myEmbed]
        };

        request.send(JSON.stringify(params));
      });
    }

    function selectImage() {
      document.getElementById('fileInput').click();
    }

    function previewImage(file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    function handleFileSelect(event) {
      const file = event.target.files[0];
      previewImage(file);
    }

    function hexToDecimal(hex) {
      return parseInt(hex.replace("#", ""), 16);
    }
  </script>

</body>
</html>
