import React, { useState } from "react";
import toast from "react-hot-toast";

import {
  CancelOrgNameBtn,
  EditOrgNameBtn,
  SaveOrgNameBtn,
} from "../../buttons/OrganizationButtons";
import OrgNameUpdateConfirmationToast from "../../../globalUtils/OrgNameUpdateConfirmationToast";
import { toastWithProgress } from "../../../globalHooks/useToastWithProgress";
import { useToastLock } from "../../../globalUtils/useToastLock";
import { createOrgNameUpdateHandler } from "../../../globalHandlers/createOrgNameUpdateHandler";

export default function OrgHeader({
  dispatch,
  organization,
  updateOrganizationName,
  updateStatus,
}) {
  const [isEditingOrgName, setIsEditingOrgName] = useState(false);
  const [orgNameInput, setOrgNameInput] = useState("");
  const toastLock = useToastLock();

  //   handle org edit
  const handleEditOrgName = () => {
    setOrgNameInput(organization?.name || "");
    setIsEditingOrgName(true);
  };

  const handleCancelOrgName = () => {
    setIsEditingOrgName(false);
    setOrgNameInput("");
  };
  const handleSaveOrgName = createOrgNameUpdateHandler(
    dispatch,
    orgNameInput.trim(),
    organization?.name,
    updateOrganizationName,
    toast,
    toastWithProgress,
    OrgNameUpdateConfirmationToast,
    toastLock,
  );

  return (
    <div>
      {isEditingOrgName ? (
        <div className="flex items-center gap-2 mt-12 sm:mt-2">
          <input
            type="text"
            value={orgNameInput}
            onChange={(e) => setOrgNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancelOrgName();
            }}
            autoFocus
            className="text-2xl font-bold bg-transparent border-b-2 border-[#9B2C62] dark:border-[#D97706] text-[#9B2C62] dark:text-[#D97706] focus:outline-none"
          />
          <SaveOrgNameBtn
            onSave={() => {
              if (!orgNameInput.trim()) return;
              if (orgNameInput.trim() === organization?.name) {
                setIsEditingOrgName(false);
                return;
              }
              handleSaveOrgName();
              setIsEditingOrgName(false);
            }}
            updateStatus={updateStatus}
          />
          <CancelOrgNameBtn onCancel={handleCancelOrgName} />
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-12 sm:mt-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#9B2C62] dark:text-[#D97706] sm:text-center lg:text-start">
            {organization?.name} Team Directory
          </h1>
          <EditOrgNameBtn onEdit={handleEditOrgName} />
        </div>
      )}
      <p className="text-gray-600 dark:text-gray-400 mt-2">
        Manage your organization's team members and permissions
      </p>
    </div>
  );
}
