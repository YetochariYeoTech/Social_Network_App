import React, { useState, useRef } from "react";
import { FaImages, FaVideo } from "react-icons/fa6";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import { BsSendFill } from "react-icons/bs";
import { GrAddCircle, GrHide } from "react-icons/gr";

function NewPost() {
  const { createPost } = usePostStore();
  const { authUser } = useAuthStore();
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    description: null,
    attachmentType: null,
    attachment: null,
  });
  const [hideForm, setHideForm] = useState(true);
  const fileInputRef = useRef(null);

  const openFileInput = (type) => {
    const fileInput = fileInputRef.current;
    fileInput.value = "";

    switch (type) {
      case "image":
        fileInput.accept = "image/*";
        setFormData((prev) => ({ ...prev, attachmentType: type }));
        break;
      case "document":
        fileInput.accept = ".pdf, .doc, .docx, .word, .xls";
        setFormData((prev) => ({ ...prev, attachmentType: type }));
        break;
      default:
        fileInput.accept = "";
    }

    fileInput.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 10000000) {
        alert("File is too large to be uploaded!");
        return;
      }

      setFileName(file.name);
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        const base64File = reader.result;
        setFormData((prev) => ({ ...prev, attachment: base64File }));
      };
    } else {
      setFileName("");
      setFormData((prev) => ({ ...prev, attachment: "" }));
    }
  };

  async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formDescription = form.description.value;

    if (!formData.attachment) {
      formData.attachmentType = "text";
    }

    const payload = {
      description: formDescription,
      attachmentType: formData.attachmentType,
      attachment: formData.attachment,
      originalFileName: fileName,
    };

    await createPost(payload);

    form.reset();
    setFileName("");
    setFormData({
      description: null,
      attachmentType: null,
      attachment: null,
    });
  }

  return (
    <form
      encType="multipart/form-data"
      className={`p-1 flex flex-col gap-3 w-full opacity-90 text-primary-content rounded-lg ${!hideForm && "bg-primary"}`}
      onSubmit={handleFormSubmit}
    >
      <div
        className={`flex  ${hideForm ? "justify-end" : "pb-3 justify-between border-b border-3 border-gray-600"}`}
      >
        <h1 className={hideForm ? "hidden" : ""}>Post something</h1>
        <button
          className="btn"
          type="button"
          onClick={() => setHideForm(!hideForm)}
        >
          {hideForm ? (
            <>
              <GrAddCircle className="h-5 w-5" />
              New post
            </>
          ) : (
            <>
              <GrHide className="h-5 w-5" />
              Hide form
            </>
          )}
        </button>
      </div>

      {/* Smooth transition wrapper */}
      <div
        className={`transition-all duration-300 ease-in-out transform origin-top ${
          hideForm
            ? "opacity-0 max-h-0 overflow-hidden scale-y-0"
            : "opacity-100 max-h-[1000px] scale-y-100"
        } flex flex-col gap-3`}
        aria-hidden={hideForm}
      >
        <div className="flex items-center gap-3">
          <img
            src={authUser?.profilePic}
            className="h-12 w-12 object-cover rounded-full"
            alt="Profile"
          />
          <input
            name="description"
            id="description"
            className="input w-full bg-white text-black"
            placeholder="Type description here"
            type="text"
          />
        </div>

        {fileName && (
          <span className="text-sm text-white font-semibold px-1">
            Selected file: {fileName}
          </span>
        )}

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
      </div>
    </form>
  );
}

export default NewPost;

// import React, { useState, useRef } from "react";
// import { FaRegUser, FaImages, FaVideo } from "react-icons/fa6";
// import { usePostStore } from "../../store/usePostStore";
// import { BsSendFill } from "react-icons/bs";
// import { GrAddCircle } from "react-icons/gr";

// function NewPost() {
//   const { createPost } = usePostStore();
//   const [fileName, setFileName] = useState("");
//   const [formData, setFormData] = useState({
//     description: null,
//     attachmentType: null,
//     attachment: null,
//   });
//   const [hideForm, setHideForm] = useState(true);

//   const fileInputRef = useRef(null);

//   const openFileInput = (type) => {
//     const fileInput = fileInputRef.current;
//     // Reset file input to allow re-selection of the same file
//     fileInput.value = "";

//     switch (type) {
//       case "image":
//         fileInput.accept = "image/*";
//         setFormData((prev) => ({ ...prev, attachmentType: type })); // Defines the type of file we selected in the datat to be sent
//         break;
//       case "document":
//         fileInput.accept = ".pdf, .doc, .docx, .word, .xls";
//         setFormData((prev) => ({ ...prev, attachmentType: type }));
//         break;
//       default:
//         setFormData((prev) => ({ ...prev, attachmentType: type }));
//         fileInput.accept = "";
//     }

//     fileInput.click();
//   };

//   // Handles the logic to be applied when a file is selected
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];

//     if (file) {
//       if (file.size > 10000000) {
//         alert("File is too large to be uploaded!");
//         file.value = "";
//         return;
//       }

//       setFileName(file.name); // ✅ fixed typo
//       const reader = new FileReader();
//       reader.readAsDataURL(file);

//       reader.onload = async () => {
//         const base64File = reader.result;

//         setFormData((prev) => ({ ...prev, attachment: base64File }));
//       };
//     } else {
//       setFileName("");
//       setFormData((prev) => ({ ...prev, attachment: "" }));
//     }
//   };

//   // This handles the logic to be applied after the form is submitted
//   async function handleFormSubmit(e) {
//     e.preventDefault(); // prevents page reload

//     const form = e.target;
//     const formDescription = form.description.value;

//     // Ensure a file is selected
//     if (formData.attachment === "") {
//       FormData.attachmentType = "text";
//     }

//     // Create a real FormData object to send files
//     const payload = {};
//     payload.description = formDescription;
//     payload.attachmentType = formData.attachmentType;
//     payload.attachment = formData.attachment; // real file here
//     payload.originalFileName = fileName;

//     // Send to store
//     await createPost(payload);

//     // Reset
//     form.reset();
//     setFileName("");
//     setFormData({
//       description: null,
//       attachmentType: null,
//       attachment: null,
//     });
//   }

//   return (
//     <form
//       encType="multipart/form-data"
//       className={`p-1 flex flex-col gap-3 w-full text-primary-content rounded-lg ${!hideForm && "bg-primary"}`}
//       onSubmit={handleFormSubmit}
//     >
//       <div
//         className={`flex  pb-3 ${hideForm ? "justify-end" : "justify-between border-b border-3 border-gray-600"}`}
//       >
//         <h1 className={hideForm && "hidden"}>Post something</h1>
//         <button
//           className="btn"
//           type="button"
//           onClick={(e) => setHideForm(!hideForm)}
//         >
//           <GrAddCircle className="h-5 w-5" />{" "}
//           {hideForm ? "New post" : "Hide form"}
//         </button>
//       </div>

//       <div className={`flex flex-col gap-3 ${hideForm && "hidden"}`}>
//         <div className={`flex items-center gap-3 `}>
//           <FaRegUser className="h-8 w-8" />
//           <input
//             name="description"
//             id="description"
//             className="input w-full bg-white text-black"
//             placeholder="Type description here"
//             type="text"
//           />
//         </div>

//         {/* File name display */}
//         {fileName && (
//           <span className="text-sm text-white font-semibold px-1">
//             Selected file: {fileName}
//           </span>
//         )}

//         {/* Hidden file input */}
//         <input
//           type="file"
//           name="attachment"
//           ref={fileInputRef}
//           className="hidden"
//           onChange={handleFileChange}
//         />

//         <div className="flex justify-between">
//           <div className="flex gap-2">
//             <button
//               type="button"
//               className="btn"
//               onClick={() => openFileInput("image")}
//             >
//               <FaImages />
//               <span>Images</span>
//             </button>
//             <button
//               type="button"
//               className="btn"
//               onClick={() => openFileInput("document")}
//             >
//               <FaVideo />
//               <span>Document</span>
//             </button>
//           </div>
//           <button
//             type="submit"
//             className="flex gap-1 items-center p-1.5 bg-blue-500 text-white font-semibold rounded-lg hover:bg-white hover:text-gray-800 hover:shadow-lg shadow-black ease-in duration-100"
//           >
//             <span>Publish</span>
//             <BsSendFill className="h-6 w-6" />
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// }

// export default NewPost;
