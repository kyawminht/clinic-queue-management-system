export async function submitAppointment(payload) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(payload), 250);
  });
}
