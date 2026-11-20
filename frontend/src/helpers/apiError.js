export const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  const data = error?.response?.data;
  if (Array.isArray(data?.errors) && data.errors.length) {
    return data.errors.map((e) => e.msg || e.message).join(", ");
  }
  return data?.message || error?.message || fallback;
};

export const getErrorMessage = (error, fallback = "Something went wrong") => {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  const apiMessage = error?.response?.data?.message;
  if (typeof apiMessage === "string" && apiMessage) return apiMessage;
  if (typeof error?.message === "string" && error.message) return error.message;
  return fallback;
};
