function Sidebar({
    fileName,
    handleFile
}) {

    return (

        <div className="sidebar">

            <h2>
                AI PDF/document/image ChatBot
            </h2>


            <label className="upload-btn">

                Upload PDF/Image

                <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    hidden
                    onChange={handleFile}
                />

            </label>


            {fileName && (

                <div className="file-box">

                    📄 {fileName}

                </div>

            )}

        </div>

    );

}

export default Sidebar;