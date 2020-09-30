import React from "react"

import Dropzone from "./Dropzone"

const Upload = () => {
    return (
        <div className='upload-component-container'>
            <div className='upload-component'>
                <h1>Upload your image</h1>
                <p>File should be Jpeg, Png...</p>
                <Dropzone />
            </div>
        </div>
    )
}

export default Upload
