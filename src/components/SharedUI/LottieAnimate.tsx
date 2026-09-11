import Lottie from "lottie-react";

interface IProps {
  altText: string;
  lottieJson: any;
  loop?: boolean;
}
const LottieAnimate = ({ altText, lottieJson, loop }: IProps) => {
  return (
    <div>
      <Lottie
        animationData={lottieJson}
        loop={loop}
        style={{ width: "100%", height: "100%" }}
        alt={altText}
      />
    </div>
  );
};

export default LottieAnimate;
