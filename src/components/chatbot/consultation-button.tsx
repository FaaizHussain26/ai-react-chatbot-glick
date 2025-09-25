import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PopupButton } from "react-calendly";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./user-form";
import { UserFormValues } from "@/schema/user.schema";

interface ConsultationButtonProps {
  calendlyUrl: string;
}

export function ConsultationButton({ calendlyUrl }: ConsultationButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);
  const [userData, setUserData] = useState<UserFormValues | null>(null);

  const handleFormSuccess = (data: UserFormValues) => {
    console.log(data, "data");
    setUserData(data);
    setUserRegistered(true);
    setShowForm(false);
  };

  return (
    <>
      {!userRegistered ? (
        <Button
          variant="outline"
          onClick={() => setShowForm(true)}
          className="flex-1 bg-[#F6A652] text-black rounded-[114px] h-[52px]"
        >
          Fill Details
        </Button>
      ) : (
        <PopupButton
          url={`${calendlyUrl}?name=${userData?.firstName} ${userData?.lastName}&email=${userData?.email}`}
          rootElement={
            document.getElementById("action-buttons") || document.body
          }
          text="Schedule Consultation"
          className="flex-1 bg-[#F6A652] text-black rounded-[114px] h-[52px]"
        />
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Register for Consultation</DialogTitle>
          </DialogHeader>
          <UserForm
            onSuccess={handleFormSuccess}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
