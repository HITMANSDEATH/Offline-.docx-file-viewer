document.getElementById("upload").addEventListener("change", function(event) {
  const file = this.files[0];
  if (!file) return;

  // Show selected file name
  const fileNameElement = document.getElementById("fileName");
  fileNameElement.textContent = file.name;

  // Validate file type
  const fileType = file.name.toLowerCase().endsWith('.doc') ? 'doc' : 
                  file.name.toLowerCase().endsWith('.docx') ? 'docx' : null;
  
  if (!fileType) {
    fileNameElement.textContent = "Please select a .doc or .docx file";
    return;
  }

  const reader = new FileReader();
  reader.onload = function() {
    const buffer = reader.result;
    const uint8Array = new Uint8Array(buffer);
    console.log("File loaded, size:", uint8Array.length);
    
    // Store file in chrome.storage.local
    chrome.storage.local.set({ 
      docxBuffer: Array.from(uint8Array),
      fileType: fileType,
      fileName: file.name
    }, function() {
      console.log("File stored in chrome.storage.local");
      // Open viewer tab
      chrome.tabs.create({ url: chrome.runtime.getURL("viewer.html") });
    });
  };
  reader.readAsArrayBuffer(file);
});
