import * as React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteModalProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trigger: React.ReactElement<any>;
    itemName?: string;
    onConfirm: () => void;
    isLoading?: boolean;
    title?: string;
    description?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    trigger,
    itemName,
    onConfirm,
    isLoading,
    title = "Xác nhận xóa",
    description = "Bạn có chắc chắn muốn xóa",
}) => {
    const [open, setOpen] = React.useState(false);

    // Clone trigger để custom onClick (ngăn đóng menu)
    const triggerWithHandler = React.cloneElement(trigger, {
        onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
        },
    });

    const handleConfirm = async () => {
        await onConfirm();
        setOpen(false);
    };

    return (
        <>
            {triggerWithHandler}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {description}
                            {itemName && (
                                <span className="font-semibold text-red-600 ml-1">{itemName}</span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer" disabled={isLoading} onClick={() => setOpen(false)}>
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isLoading}
                            onClick={handleConfirm}
                            className="bg-red-600 hover:bg-red-700 cursor-pointer"
                        >
                            {isLoading ? "Đang xóa..." : "Xác nhận xóa"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ConfirmDeleteModal;