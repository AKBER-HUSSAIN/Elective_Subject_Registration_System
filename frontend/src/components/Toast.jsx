import toast from "react-hot-toast";

const commonToastStyle = {
  minWidth: "380px",
  maxWidth: "560px",
  fontSize: "16px",
  padding: "16px 24px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 3000,
      position: "top-center",
      style: {
        ...commonToastStyle,
        background: "#059669", // Darker green for better readability
        color: "white",
      },
    });
  },
  error: (message) => {
    toast.error(message, {
      duration: 5000,
      position: "top-center",
      style: {
        ...commonToastStyle,
        background: "#DC2626", // Darker red for better readability
        color: "white",
      },
    });
  },
  loading: (message) => {
    return toast.loading(message, {
      position: "top-center",
      style: {
        ...commonToastStyle,
        background: "#1E40AF", // Dark blue for loading state
        color: "white",
      },
    });
  },
};
