import React from "react";

interface IProps {
  length: number;
}
const SkeletonLoaderForList = ({length}:IProps) => {
  return (
    <div className="animate-pulse">
      {[...Array(length)].map((_, i) => (
        <div key={i} className="w-full h-12 bg-gray-200 rounded mb-4"></div>
      ))}
    </div>
  );
};

export default SkeletonLoaderForList;
