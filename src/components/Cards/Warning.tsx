import { IWarningProps } from "../../Types/interface";

const Warning = (props: IWarningProps) => {
  return (
    <div className="absolute top-4 right-0 left-0 items-center w-full " style={{ zIndex: 15 }}>
      <div
        className="flex items-center justify-center bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative w-300 m-auto"
        role="alert"
      >
        <div>
          <strong className="font-bold">{props.message}</strong>
        </div>
      </div>
    </div>
  );
};

export default Warning;
