import { Mail, Trash2, Edit3, RefreshCcw, Archive } from "lucide-react";
import { ArchiveClientBtn, DeleteClientBtn } from "../buttons/ClientButtons";

export default function ClientCard({
  client,
  id,
  Link,
  handleArchiveToggle,
  localIsArchived,
  handleDelete,
}) {
  return (
    <section className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-[#9B2C62] dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:border-[#D97706] dark:hover:shadow-[0_4px_15px_rgba(255,255,255,0.05)]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h1 className="text-3xl font-bold text-[#D97706] dark:text-[#F59E0B] mb-2 md:mb-0">
          {client.name}
        </h1>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Primary Actions Row */}
          <div className="flex gap-2">
            {/* edit client */}
            {client && (
              <Link
                to={`/clients/${id}/edit`}
                className="flex items-center bg-[#F59E0B] hover:bg-[#D97706] text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 dark:bg-[#D97706] dark:hover:bg-[#F59E0B] flex-1 sm:flex-none justify-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Link>
            )}

            {/* archive/restore toggle */}
            <ArchiveClientBtn
              handleArchiveToggle={handleArchiveToggle}
              id={id}
              localIsArchived={localIsArchived}
              client={client}
            />
          </div>

          {/* Delete Button */}
          <DeleteClientBtn
            handleDelete={handleDelete}
            id={id}
            client={client}
          />
        </div>
      </div>

      {/* email and phone number */}
      <div className="space-y-3">
        <div className="flex items-center items-center">
          <span>
            <Mail className="w-5 h-5 font-bold mr-2 text-[#9B2C62] dark:text-[#D97706]" />
          </span>
          <p className="text-gray-700 dark:text-gray-400 break-all">
            {client.contact?.email || (
              <span className="text-gray-400 text-sm">No email provided</span>
            )}
          </p>
        </div>
        <div className="flex items-center">
          <span className="text-[#F59E0B] mr-2 mt-1">📞</span>
          <p className="text-gray-700 dark:text-gray-400">
            {client.contact?.phone || (
              <span className="text-gray-400 text-sm">No phone provided</span>
            )}
          </p>
        </div>

        {/* company */}
        <div className="mt-4 pt-4 border-t border-[#F3E8FF] dark:border-[#F3E8FF]/20">
          <h3 className="font-semibold text-[#9B2C62] dark:text-[#F59E0B] mb-1">
            Company
          </h3>
          <p className="text-gray-700 dark:text-gray-400">
            {client.company || "Individual"}
          </p>
        </div>

        {/* preferences */}
        {client.preferences && (
          <div className="mt-4 pt-4 border-t border-[#F3E8FF] dark:border-[#F3E8FF]/20">
            <h3 className="font-semibold text-[#9B2C62] dark:text-[#F59E0B] mb-1">
              Preferences
            </h3>
            <p className="text-gray-700 dark:text-gray-400">
              {client.preferences}
            </p>
          </div>
        )}

        {/* notes */}
        {client.notes && (
          <div className="mt-4 pt-4 border-t border-[#F3E8FF] dark:border-[#F3E8FF]/40">
            <h3 className="font-semibold text-[#9B2C62] dark:text-[#F59E0B] mb-1">
              Notes
            </h3>
            <p className="text-gray-700 dark:text-gray-400 whitespace-pre-line">
              {client.notes}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
