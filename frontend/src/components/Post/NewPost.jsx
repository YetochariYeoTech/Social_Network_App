import React, { useState, useRef } from "react";
import { FaRegUser, FaImages, FaVideo } from "react-icons/fa6";
import { BsSendFill } from "react-icons/bs";

function NewPost() {
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  const openFileInput = (type) => {
    const fileInput = fileInputRef.current;

    // Reset file input to allow re-selection of the same file
    fileInput.value = "";

    switch (type) {
      case "image":
        fileInput.accept = "image/*";
        break;
      case "document":
        fileInput.accept = ".pdf, .doc, .docx, .word, .xls";
        break;
      default:
        fileInput.accept = "";
    }

    fileInput.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
  };

  function handleFormSubmit(e) {
    e.preventDefault(); // prevents page reload

    const formData = new FormData(e.target); // `e.target` is the form element

    const description = formData.get("description");
    const file = formData.get("attachment");

    console.log("Description:", description);
    console.log("File:", file); // This will be a File object (or null if none)

    e.target.reset();
    setFileName("");

    // You can now send `formData` to an API if needed
  }

  return (
    <form
      className="p-1 flex flex-col gap-3 w-full bg-primary text-primary-content rounded-lg"
      onSubmit={handleFormSubmit}
    >
      <h1 className="border-b border-3 border-gray-600 pb-3">Post something</h1>

      <div className="flex items-center gap-3">
        <FaRegUser className="h-8 w-8" />
        <input
          name="description"
          className="input w-full bg-white text-black"
          placeholder="Type description here"
          type="text"
        />
      </div>

      {/* File name display */}
      {fileName && (
        <span className="text-sm text-white font-semibold px-1">
          Selected file: {fileName}
        </span>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        name="attachment"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => openFileInput("image")}
          >
            <FaImages />
            <span>Images</span>
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => openFileInput("document")}
          >
            <FaVideo />
            <span>Document</span>
          </button>
        </div>
        <button
          type="submit"
          className="flex gap-1 items-center p-1.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-white hover:text-gray-800 hover:shadow-lg shadow-black ease-in duration-100"
        >
          <span>Publish</span>
          <BsSendFill className="h-6 w-6" />
        </button>
      </div>
    </form>
  );
}

export default NewPost;

// import React, { useState } from "react";
// import { FaRegUser, FaImages, FaVideo, FaFile } from "react-icons/fa6";
// import { BsSendFill } from "react-icons/bs";

// function NewPost() {
//   const [fileName, setFileName] = useState(""); // This state helps top get the choosen file name

//   function handleFileChange() {
//     const file = document.getElementById("inputFile");

//     // If there is a file selected, assign the value to the state. Else, set it to empty
//     if (file.files[0]) {
//       setFileName(fileInput.files[0].name);
//     } else {
//       setFileName("");
//     }
//   }

//   // This method changes the content-type of the file input
//   function openFileInput(type) {
//     const fileInput = document.getElementById("fileInput");

//     switch (type) {
//       case "image":
//         fileInput.accept = "image/*";
//         break;
//       case "document":
//         fileInput.accept = ".pdf, .doc, .docx, .word, .xls";
//         break;
//       default:
//         fileInput.accept = "";
//     }

//     fileInput.click();
//   }

//   return (
//     <form className="p-1 flex flex-col gap-3 w-full bg-primary text-primary-content rounded-lg">
//       <h1 className="border-b border-3 border-gray-600 pb-3">Post something</h1>
//       <div className="flex items-center gap-3">
//         <FaRegUser className="h-8 w-8" />
//         {/* Description input field */}
//         <input
//           name="description"
//           className="input w-full bg-white text-black"
//           placeholder="Type description here"
//           type="text"
//           onChange={() => handleFileChange()}
//         />
//       </div>
//       {/* File input that should conitain the differents attachments dynamically */}
//       <input type="file" name="attachment" id="fileInput" className="hidden" />
//       <span className="semibold text-white">{fileName}</span>
//       {/* The differents buttons that allows to select the document type */}
//       <div className="flex justify-between">
//         <div className="flex gap-2">
//           <div className="btn" onClick={() => openFileInput("image")}>
//             <FaImages className="" />
//             <span>Images</span>
//           </div>
//           <div className="btn" onClick={() => openFileInput("document")}>
//             <FaVideo className="" />
//             <span>Document</span>
//           </div>
//           {/* <div className="btn" onClick={openFileInput("image")}>
//             <FaFile className="" />
//             <span>Link</span>
//           </div> */}
//         </div>
//         <button
//           type="submit"
//           className="flex gap-1 justify-between items-center p-1.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-white hover:text-gray-800 hover:shadow-lg shadow-black ease-in duration-100"
//         >
//           <span>Publish</span>
//           <BsSendFill className="h-6 w-6" />
//         </button>
//       </div>
//     </form>
//   );
// }

// export default NewPost;
