
import { validateFields } from "../utils/valiadation";
import { getErrorMessage } from "../../shared/utils/errorHandler";
import toast from "react-hot-toast";

export const useFormHandler = (apiFunction, setErrors, setLoading) => {
    return async (fields, onSuccess) => {
        const validationErrors = validateFields(fields);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setLoading?.(true);
            setErrors({});

            const data = await apiFunction(fields);

            if (!data) return;

            if (data?.success) {
                toast.success(data.message || "Success 🎉");
            }

            onSuccess?.(data);

        } catch (error) {
            const message = getErrorMessage(error);

            setErrors({
                api: message
            });

            toast.error(message);

        } finally {
            setLoading?.(false);
        }
    };
};
