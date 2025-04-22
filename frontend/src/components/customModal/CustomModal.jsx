// components/CustomModal.jsx
import * as Dialog from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import "./customModal.scss";
import Dompurify from "dompurify";
import Slider from "../../components/slider/Slider";

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

const CustomModal = ({ isOpen, onClose, post }) => {
  // Guard clause: if post is not defined, don't render modal content
  if (!post) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="modalOverlay"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
        </Dialog.Overlay>
        <Dialog.Content asChild>
          <motion.div
            className="modalContent"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Dialog.Close asChild>
              <button className="closeBtn">
                <X size={20} />
              </button>
            </Dialog.Close>

            <h3>{post.title}</h3>

            {post.images.length > 0 && (
              <Slider images={post.images} />
            )}

            <div className="modalDetails">
              <p><strong>City:</strong> {post.city}</p>
              <p><strong>Price:</strong> ${post.price?.toLocaleString()}</p>
              <p><strong>Bedrooms:</strong> {post.bedroom}</p>
              <p><strong>Bathrooms:</strong> {post.bathroom}</p>
              <p><strong>Type:</strong> {post.type}</p>
              <p><strong>Property:</strong> {post.property}</p>
              <p><strong>Address:</strong> {post.address}</p>
              <p><strong>Posted by:</strong> {post.user?.username || "N/A"}</p>

              <hr />

              {post.postDetail ? (
                <>
                  <div>
                    <strong>Description:</strong>
                    <div  className="description"
                      dangerouslySetInnerHTML={{
                        __html: Dompurify.sanitize(post.postDetail.desc),
                      }}
                    />
                  </div>
                  <p><strong>Utilities:</strong> {post.postDetail.utilities || "N/A"}</p>
                  <p><strong>Pet Policy:</strong> {post.postDetail.pet || "N/A"}</p>
                  <p><strong>Income Requirement:</strong> {post.postDetail.income || "N/A"}</p>
                  <p><strong>Size:</strong> {post.postDetail.size || "N/A"} sq ft</p>
                </>
              ) : (
                <p>No extra details available.</p>
              )}
            </div>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CustomModal;
