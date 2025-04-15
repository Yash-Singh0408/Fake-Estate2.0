// MessageSkeleton.jsx
import "./messageSkeleton.scss";

const MessageSkeleton = () => {
  return (
    <>
    <div className="messagePreviewSkeleton">
      <div className="avatarSkeleton" />
      <div className="textSkeleton">
        <div className="line short" />
        <div className="line long" />
      </div>
    </div>
    <div className="messagePreviewSkeleton">
      <div className="avatarSkeleton" />
      <div className="textSkeleton">
        <div className="line short" />
        <div className="line long" />
      </div>
    </div>
    <div className="messagePreviewSkeleton">
      <div className="avatarSkeleton" />
      <div className="textSkeleton">
        <div className="line short" />
        <div className="line long" />
      </div>
    </div>
    </>
  );
};

export default MessageSkeleton;
