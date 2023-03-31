import Cropper from "react-easy-crop";
import { GrFormClose } from "react-icons/gr";

const Crop = ({
  uploadedImage,
  crop,
  zoom,
  setCrop,
  cropComplete,
  setZoom,
  setCropStatus,
  setUserImage,
  setUploadFile,
  defaultProfile,
  getcroppedImage,
}: any) => {
  return (
    <div className="absolute z-10 flex flex-col items-center top-0 right-0 left-0 bottom-0  h-full m-auto justify-center w-90 md:w-50">
      <div className=" relative w-90 md:w-50" style={{ height: "50vh" }}>
        <div>
          <Cropper
            image={uploadedImage}
            crop={crop}
            zoom={zoom}
            aspect={5 / 5}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onCropComplete={cropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <div
          className=" absolute top-0 right-0 cursor-pointer"
          style={{ right: "-10px", top: "-10px" }}
          onClick={() => {
            setCropStatus(false);
            setUserImage(defaultProfile);
            setUploadFile(null);
          }}
        >
          <GrFormClose fontSize={28} className="hover:bg-bgHoverActive bg-bgHover rounded-full" />
        </div>
      </div>
      <div className="flex flex-col gap-4 w-90 md:w-50 bg-gray-700 ">
        <div className="flex justify-center items-center mt-3">
          <input
            id="small-range"
            type="range"
            min={1}
            max={50}
            value={zoom}
            onChange={(e: any) => {
              setZoom(e.target.value);
            }}
            className="w-50 h-2 bg-blue-100 appearance-none"
          />
        </div>

        <div className="flex items-center justify-center mb-3">
          <button className="px-3 py-2 bg-violet-700 hover:bg-violet-900 rounded-lg text-white" onClick={getcroppedImage}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Crop;
