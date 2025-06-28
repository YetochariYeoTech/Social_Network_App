import React, { useState, useRef } from "react";
import { FaImages } from "react-icons/fa6";
import { IoDocumentTextSharp } from "react-icons/io5";
import { usePostStore } from "../../store/usePostStore";
import { useAuthStore } from "../../store/useAuthStore";
import { BsSendFill } from "react-icons/bs";
import { GrAddCircle, GrHide } from "react-icons/gr";
import { Spinner, Text, VStack } from "@chakra-ui/react";

function NewPost() {
  const { createPost, creatingPost } = usePostStore();
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

  const htmlContent = creatingPost ? (
    <DisplaySpinner />
  ) : (
    <form
      encType="multipart/form-data"
      className={`p-1 flex flex-col gap-3 w-full text-base-content rounded-lg ${!hideForm && "bg-base-200 shadow-md"}`}
      onSubmit={handleFormSubmit}
    >
      <div
        className={`flex  ${hideForm ? "justify-end" : "pb-3 justify-between border-b border-3 border-gray-600"}`}
      >
        <h1 className={hideForm ? "hidden" : ""}>Post something</h1>
        <button
          className="btn bg-base-300 text-base-content hover:text-base-content shadow-md"
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
            src={authUser?.profilePic || "/avatar.png"}
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
          <span className="text-sm text-base-content font-semibold px-1 italic opacity-70 ml-3">
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
              <IoDocumentTextSharp />
              <span>Document</span>
            </button>
          </div>
          <button
            type="submit"
            className="flex gap-1 items-center p-1.5 bg-primary text-white font-semibold rounded-lg hover:bg-white hover:text-gray-800 hover:shadow-lg shadow-black ease-in duration-100"
          >
            <span>{creatingPost ? "Wait a bit..." : "Publish"}</span>
            <BsSendFill className="h-6 w-6" />
          </button>
        </div>
      </div>
    </form>
  );

  return htmlContent;
}

const DisplaySpinner = () => {
  return (
    <VStack colorPalette="teal">
      <Spinner color="blue.500" size="lg" borderWidth="4px" />
      <Text color="colorPalette.600">Loading...</Text>
    </VStack>
  );
};

export default NewPost;
