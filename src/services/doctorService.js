export const initialDoctors = [
  {
    id: 'dr-khin',
    name: 'Dr. Khin Thida',
    specialtyKey: 'specialtyGeneral',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    availableSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '01:30 PM'],
  },
  {
    id: 'dr-zaw',
    name: 'Dr. Zaw Moe',
    specialtyKey: 'specialtyChild',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    availableSlots: ['09:30 AM', '10:30 AM', '12:00 PM', '02:00 PM'],
  },
  {
    id: 'dr-mya',
    name: 'Dr. Mya Sandar',
    specialtyKey: 'specialtyWomen',
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80',
    availableSlots: ['08:30 AM', '10:15 AM', '01:00 PM', '03:00 PM'],
  },
];

export async function fetchDoctors() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(initialDoctors), 250);
  });
}
