window.addEventListener("DOMContentLoaded", () => {
  const outputElement = document.getElementById("output");
  
  if (!outputElement) {
    console.error("Output element not found");
    return;
  }

  // Get file from chrome.storage.local
  chrome.storage.local.get(['docxBuffer', 'fileType', 'fileName'], function(result) {
    console.log("Viewer loaded, stored data:", result.docxBuffer ? "present" : "missing");
    console.log("File type:", result.fileType);
    console.log("File name:", result.fileName);
    
    if (!result.docxBuffer) {
      console.error("No file data found in chrome.storage.local");
      outputElement.innerHTML = '<div class="error">No file loaded. Please select a .doc or .docx file.</div>';
      return;
    }

    try {
      const buffer = new Uint8Array(result.docxBuffer).buffer;
      console.log("Buffer created, size:", buffer.byteLength);

      // Validate file type
      if (!result.fileType || !['doc', 'docx'].includes(result.fileType.toLowerCase())) {
        outputElement.innerHTML = '<div class="error">Invalid file type. Please select a .doc or .docx file.</div>';
        return;
      }

      if (typeof mammoth === 'undefined') {
        outputElement.innerHTML = '<div class="error">Error: mammoth library not loaded. Please reload the extension.</div>';
        return;
      }

      // Show loading message
      outputElement.innerHTML = '<div class="loading">Loading document</div>';

      // Configure mammoth options
      const options = {
        arrayBuffer: buffer,
        convertImage: mammoth.images.imgElement((image) => {
          return image.read().then((imageBuffer) => {
            const base64 = btoa(
              new Uint8Array(imageBuffer)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            return {
              src: `data:${image.contentType};base64,${base64}`
            };
          });
        }),
        styleMap: [
          "p[style-name='Title'] => h1.title",
          "p[style-name='Heading 1'] => h1",
          "p[style-name='Heading 2'] => h2",
          "p[style-name='Heading 3'] => h3",
          "p[style-name='Normal'] => p.normal",
          "r[style-name='Strong'] => strong",
          "r[style-name='Emphasis'] => em",
          "r[style-name='Code'] => code"
        ]
      };

      // Use mammoth for both file types
      mammoth.convertToHtml(options)
        .then(result => {
          if (result.messages.length > 0) {
            console.log("Conversion messages:", result.messages);
          }
          if (result.value) {
            console.log("Conversion successful");
            outputElement.innerHTML = result.value;
          } else {
            throw new Error("No content found in the file");
          }
        })
        .catch(err => {
          console.error("Conversion error:", err);
          let errorMessage = err.message;
          if (errorMessage.includes("Could not find the body element")) {
            if (result.fileType.toLowerCase() === 'doc') {
              errorMessage = "Unable to convert this .doc file. Please try converting it to .docx format using Microsoft Word or another word processor.";
            } else {
              errorMessage = "The file appears to be corrupted or is not a valid Word document. Please try a different file.";
            }
          }
          outputElement.innerHTML = `<div class="error">${errorMessage}</div>`;
        });
    } catch (err) {
      console.error("Error processing file data:", err);
      outputElement.innerHTML = `<div class="error">Error processing file: ${err.message}</div>`;
    }
  });
}); 