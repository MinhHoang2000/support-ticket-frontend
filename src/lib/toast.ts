import { toast as sonnerToast } from "sonner";

/** Show a success notification toast */
export function toastSuccess(message: string) {
  sonnerToast.success(message);
}

/** Show an error notification toast */
export function toastError(message: string) {
  sonnerToast.error(message);
}

/** Re-export toast for direct sonner API access (e.g. promise, loading) */
export const toast = sonnerToast;
