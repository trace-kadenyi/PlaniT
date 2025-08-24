import { ClientInfo } from "../../shared/UIFragments";
import { VendorInfo } from "../../shared/UIFragments";
import { formatDateTime, getStatusColor } from "../utils/formatting";
import BudgetOverview from "../budgeting/BudgetOverview";

export default function EventDetailsCard({
  event,
  Link,
  localVendors,
  expensesState,
  id,
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-5 mt-10 sm:mt-0">
        <p className="inline-block text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-[#F8D476] to-[#F59E0B] text-[#6B3B0F] font-medium tracking-wide">
          {event.type}
        </p>
        {event.client && <ClientInfo event={event} Link={Link} />}
      </div>

      {/* event name */}
      <h1 className="mt-3 text-2xl font-bold text-[#9B2C62]">{event.name}</h1>
      {/* event date */}
      <p className="text-sm text-gray-600 font-bold">
        {formatDateTime(event.date)}
      </p>
      {/* event desc */}
      <p className="text-sm text-gray-700">{event.description}</p>
      {/* event location */}
      <div className="grid sm:grid-cols-2 gap-2 pt-4 text-sm text-gray-600">
        <div>
          <span className="font-semibold text-gray-500">Venue:</span>{" "}
          {event.location.venue}
        </div>
        <div>
          <span className="font-semibold text-gray-500">Address:</span>{" "}
          {event.location.address}
        </div>
        <div>
          <span className="font-semibold text-gray-500">City:</span>{" "}
          {event.location.city}
        </div>
        <div>
          <span className="font-semibold text-gray-500">Country:</span>{" "}
          {event.location.country}
        </div>
        {/* event status */}
        <div>
          <span className="font-semibold text-gray-500">Status:</span>{" "}
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
              event.status
            )}`}
          >
            {event.status}
          </span>
        </div>
      </div>

      {/* vendors section */}
      {localVendors.length > 0 ? (
        <VendorInfo vendors={localVendors} Link={Link} />
      ) : (
        <div className="mt-4 text-xs text-gray-500 font-semibold">
          No vendors associated yet. Vendors will appear here when added through
          expenses.
        </div>
      )}

      {/* budget overview bar */}
      {expensesState.budgetStatus && (
        <BudgetOverview
          budgetStatus={expensesState.budgetStatus}
          Link={Link}
          eventID={id}
        />
      )}
    </div>
  );
}
