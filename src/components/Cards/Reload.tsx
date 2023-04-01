import logo from "./.././.././assets/Navbar/logo.svg";
import ipfsLogo from "./.././.././assets/Auth/ipfs-logo.svg";
import fileCoinLogo from "./../././.././assets/Auth/filecoin-logo.svg";

const Reload = ({ refreshStatus }: any) => {
  return (
    <div className="relative w-full h-screen">
      <div className=" absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 text-center ">
        <div className="p-5 flex justify-between items-center  gap-10 top-0">
          <img src={ipfsLogo} alt="ipfs-logo" width="48px" height="48px" loading="lazy"></img>

          <img alt="app-logo" src={logo} width="100px" height="100px" loading="lazy"></img>
          <img
            alt="file coin logo"
            src={fileCoinLogo}
            width="38px"
            height="38px"
            loading="lazy"
          ></img>
        </div>
        <div className="border flex flex-col bg-white w-300  rounded-lg">
          {refreshStatus ? (
            <>
              <div className="flex flex-col items-center justify-center text-2xl font-bold">
                <h1 className="m-3">Welcome!!</h1>
              </div>
              {/* 
              <div className="flex flex-col gap-3 font-medium">
                <div className="px-5 py-4">
                  <button
                    className="border-black flex border rounded-lg justify-between w-full px-4 py-3 hover:text-white hover:bg-black"
                    onClick={() => window.location.reload()}
                  >
                    Reload
                    <img src={reload} width="30px" height="20px"></img>
                  </button>
                </div>
              </div> */}
            </>
          ) : (
            <>
              <div className="flex items-center justify-center text-2xl font-bold">
                <h1 className="m-3">Welcome!!!</h1>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reload;
