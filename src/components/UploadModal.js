/**
 * Modal that shows progress of upload
 */

import React from "react"

const UploadModal = ({
    uploadModalRef,
    uploadRef,
    progressRef,
    uploadedImageURL,
}) => {
    const closeUploadModal = () => {
        uploadModalRef.current.style.display = "none"
    }
    return (
        <div>
            <div className='upload-modal' ref={uploadModalRef}>
                <div className='overlay'></div>
                <div className='close' onClick={() => closeUploadModal()}>
                    X
                </div>
                <div className='progress-container'>
                    <span ref={uploadRef}></span>
                    <div className='progress'>
                        <div className='progress-bar' ref={progressRef}></div>
                    </div>
                </div>
                <div className='uploaded-image-container'>
                    {uploadedImageURL && (
                        <img
                            src={uploadedImageURL}
                            alt='uploaded result'
                            width='100px'
                            height='100px'
                            loading='eager'
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default UploadModal
