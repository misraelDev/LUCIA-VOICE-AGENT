"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, LogOut, X } from "lucide-react";

export type ConfirmLogoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  submitting?: boolean;
};

export function ConfirmLogoutDialog({
  open,
  onOpenChange,
  onConfirm,
  submitting = false,
}: ConfirmLogoutDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (submitting) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-[90vw] sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#1868db]">Cerrar sesión</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas cerrar sesión? Deberás volver a iniciar
            sesión para acceder al panel.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2 border-t border-gray-200 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            className="border-[#1868db] text-[#1868db] hover:bg-[#1868db] hover:text-white"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            className="bg-[#1868db] text-white hover:bg-[#1458c4] focus-visible:ring-[#1868db]"
            onClick={() => void onConfirm()}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cerrando sesión...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
