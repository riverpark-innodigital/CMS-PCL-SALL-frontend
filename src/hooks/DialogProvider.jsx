import { createContext, useContext, useState, useCallback } from "react";
import { ErrorDialog401 } from "../components/content-modal/alert-dialog";

const DialogContext = createContext();

export const dialogHandler = {
  showDialog: () => {},
};

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    description: "",
    onCancel: null,
  });

  const showDialog = useCallback((title, description, onCancel ) => {
    setDialog({ open: true, title, description, onCancel });
  }, []);

  const hideDialog = useCallback(() => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    setDialog((prev) => ({ ...prev, open: false, onCancel: null }));
  }, [dialog.onCancel]);

  dialogHandler.showDialog = showDialog;

  return (
    <DialogContext.Provider value={{ showDialog, hideDialog }}>
      {children}
      <ErrorDialog401
        title={dialog.title}
        description={dialog.description}
        open={dialog.open}
        onCancel={hideDialog}
      />
    </DialogContext.Provider>
  );
}

export function useDialog() {
  return useContext(DialogContext);
}
