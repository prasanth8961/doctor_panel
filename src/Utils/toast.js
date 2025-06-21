import { toast as reactToast } from 'react-toastify';

class Toast {
  success(msg, options = {}) {
    reactToast.success(msg, options);
  }

  error(msg, options = {}) {
    reactToast.error(msg, options);
  }

  warn(msg, options = {}) {
    reactToast.warn(msg, options);
  }

  info(msg, options = {}) {
    reactToast.info(msg, options);
  }

  dark(msg, options = {}) {
    reactToast.dark(msg, options);
  }

  dismiss() {
    reactToast.dismiss();
  }
}

const toast = new Toast();
export default toast;
