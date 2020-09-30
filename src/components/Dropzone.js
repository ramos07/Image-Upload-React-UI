import React, { useRef, useState } from "react"
import dropImageBg from "../image.svg"
import axios from "axios"
import UploadModal from "./UploadModal"

const Dropzone = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadedImageURL, setUploadedImageURL] = useState("")

    const uploadModalRef = useRef()
    const uploadRef = useRef()
    const progressRef = useRef()

    const dragOver = (e) => {
        e.preventDefault()
    }
    const dragEnter = (e) => {
        e.preventDefault()
    }
    const dragLeave = (e) => {
        e.preventDefault()
    }
    const fileDrop = (e) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        console.log(file.name)
        console.log(file)
        if (file !== undefined) {
            handleFile(file)
        }
    }

    /**
     * Function that handles the image file being uploaded.
     * It validates and sets the image file state.
     * Creates an alert if the file is not valid.
     * @param {object} file
     */
    const handleFile = (file) => {
        if (validateFile(file)) {
            setSelectedFile(file)
        } else {
            alert("The file type is not permitted.")
        }
    }

    /**
     * Function that validates the file type of the image. If the
     * file type is not valid then it returns false, else it returns true.
     * @param {object} file - The file being uploaded.
     */
    const validateFile = (file) => {
        // The image file types that are valid
        const validTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/x-icon",
        ]
        if (validTypes.indexOf(file.type) === -1) {
            return false
        }
        return true
    }

    /**
     * Function that converts the image size to bytes, kb, mb, gb ... and returns the float value.
     * @param {number} size - The size of the image that is to be uploaded.
     */
    const fileSize = (size) => {
        if (size === 0) {
            return "0 Bytes"
        }
        const k = 1024
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
        const i = Math.floor(Math.log(size) / Math.log(k))

        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    }

    /**
     *  Function that strips the file type off the name of an image file.
     * @param {string} fileName - The name of the image file being uploaded (ex: "image.jpg")
     */
    const fileType = (fileName) => {
        return (
            fileName.substring(
                fileName.lastIndexOf(".") + 1,
                fileName.length
            ) || fileName
        )
    }

    /**
     * Function that clears the selected image state.
     */
    const removeFile = () => {
        setSelectedFile(null)
    }

    const uploadFile = () => {
        if (selectedFile) {
            uploadModalRef.current.style.display = "block"
            const formData = new FormData()
            formData.append("image", selectedFile)
            formData.append("key", process.env.REACT_APP_IMGBB_API_KEY)
            console.log(formData)
            axios
                .post("https://api.imgbb.com/1/upload", formData, {
                    onUploadProgress: (progressEvent) => {
                        console.log(progressEvent)
                        const uploadPercentage = Math.floor(
                            (progressEvent.loaded / progressEvent.total) * 100
                        )
                        progressRef.current.innerHTML = `${uploadPercentage}%`
                        progressRef.current.style.width = `${uploadPercentage}%`
                        if (uploadPercentage === 100) {
                            uploadRef.current.innerHTML =
                                "File has been uploaded"
                            setSelectedFile(null)
                        }
                    },
                })
                .then((res) => {
                    // In the response get the URL of the uploaded image
                    const url = res.data.data.url
                    setUploadedImageURL(url)
                })
                .catch((error) => {
                    console.error(error.message)
                    // If theres an error display the message on the modal
                    uploadModalRef.current.innerHTML = `<span class="error">Error uploading file</span>`
                    // set progress to red
                    progressRef.current.style.backgroundColor = "red"
                })
        } else {
            alert("You have to drop/select an image in order to upload.")
        }
    }

    return (
        <>
            <div
                className='drop-zone'
                onDragOver={dragOver}
                onDragEnter={dragEnter}
                onDragLeave={dragLeave}
                onDrop={fileDrop}
            >
                <img src={dropImageBg} alt='drop content' />
                <p>Drag and drop your image</p>
            </div>
            <div className='file-display-container'>
                {selectedFile && (
                    <div className='file-status-bar'>
                        <div>
                            <div className='file-type-logo'></div>
                            <div className='file-type'>
                                {fileType(selectedFile.name)}
                            </div>
                            <span className='file-name'>
                                {selectedFile.name}
                            </span>
                            <span className='file-size'>
                                {fileSize(selectedFile.size)}
                            </span>
                        </div>
                        <div className='file-remove' onClick={removeFile}>
                            X
                        </div>
                    </div>
                )}
            </div>
            <button className='upload-button' onClick={() => uploadFile()}>
                Upload
            </button>
            <UploadModal
                uploadModalRef={uploadModalRef}
                uploadRef={uploadRef}
                progressRef={progressRef}
                uploadedImageURL={uploadedImageURL}
            />
        </>
    )
}

export default Dropzone
