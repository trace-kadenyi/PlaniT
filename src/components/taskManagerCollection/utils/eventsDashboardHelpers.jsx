export const mapEventToCard = (event) => ({
  id: event._id,
  name: event.name,
  type: event.type,
  date: event.date,
  location: event.location,
  budgetStatus: event.budgetStatus,
  status: event.status,
  description: event.description,
});


