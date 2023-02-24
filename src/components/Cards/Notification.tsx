import React from "react";
import { INotificationProps } from "../../Types/interface";

const Notification = (props: INotificationProps) => {
  return (
    <div className="border-orange-300	p-5 flex flex-col gap-2 rounded-lg w-full">
      <div className="flex gap-2 items-center font-bold">
        {props.headerImg}
        {props.title}
      </div>
      <div>
        <p>{props.description}</p>
      </div>
      <div className="flex gap-2 items-center font-bold">
        {props.footerImg}
        {props.footerContent}
      </div>
    </div>
  );
};

export default Notification;
