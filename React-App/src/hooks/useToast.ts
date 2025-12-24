import { toast, ToastOptions, TypeOptions } from 'react-toastify';

const DEFAULT_OPTIONS: ToastOptions = {
    position: "bottom-right",
};

type ShowToastFunction = (
    message: string, 
    type?: TypeOptions,
    options?: ToastOptions 
) => void;

export const useToast = (): ShowToastFunction => {
    
    const showToast: ShowToastFunction = (message, type = 'default', options = {}) => {
        const finalOptions: ToastOptions = {
            ...DEFAULT_OPTIONS,
            ...options,
        };

        switch (type) {
            case 'success':
                toast.success(message, finalOptions);
                break;
            case 'error':
                toast.error(message, finalOptions);
                break;
            case 'info':
                toast.info(message, finalOptions);
                break;
            case 'warning':
                toast.warn(message, finalOptions);
                break;
            default:
                toast(message, finalOptions);
                break;
        }
    };

    return showToast;
};