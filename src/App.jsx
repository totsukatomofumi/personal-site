import { useState } from "react";
import { ImagePreview, Text } from "./components";
import { APP_CONTEXT as AppContext } from "../constants";

function App() {
  // ========================== Setup ===========================
  const contextValue = {};

  // ====================== Image Preview =======================
  const [imagePreview, setImagePreview] = useState({
    open: false,
    src: null,
    alt: "",
  });

  const openImagePreview = (src, alt) => {
    setImagePreview({
      open: true,
      src: src,
      alt: alt,
    });
  };

  const closeImagePreview = () => {
    setImagePreview({
      ...imagePreview,
      open: false,
    });
  };

  contextValue.openImagePreview = openImagePreview;
  contextValue.closeImagePreview = closeImagePreview;

  // ========================== Render ==========================
  return (
    <AppContext value={contextValue}>
      <ImagePreview {...imagePreview} onClose={closeImagePreview} />
      <Text />
    </AppContext>
  );
}

export default App;
