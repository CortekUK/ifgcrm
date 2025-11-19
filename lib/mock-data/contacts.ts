// Mock contacts database for matching logic
export const mockContacts = [
  {
    id: '101',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+44 7700 900123',
    programme: 'US College 2026',
  },
  {
    id: '102',
    name: 'Sarah Mensah',
    email: 'sarah.m@email.com',
    phone: '+233 24 555 0198',
    programme: 'US College 2026',
  },
  {
    id: '103',
    name: 'David Boateng',
    email: 'dboateng@outlook.com',
    phone: '+233 20 555 0223',
    programme: 'European Academy',
  },
  {
    id: '104',
    name: 'Grace Owusu',
    email: 'grace.owusu@gmail.com',
    phone: '+233 27 555 0167',
    programme: 'UK Programme',
  },
  {
    id: '105',
    name: 'Michael Chen',
    email: 'mchen@outlook.com',
    phone: '+1 555 234 5678',
    programme: 'UK Programme',
  },
  {
    id: '106',
    name: 'Emma Johnson',
    email: 'emma.j@parent.com',
    phone: '+44 7700 900789',
    programme: 'European Academy',
  },
  {
    id: '107',
    name: 'Sophie Williams',
    email: 'sophie.w@gmail.com',
    phone: '+44 7700 900456',
    programme: 'US College 2027',
  },
  {
    id: '108',
    name: 'James Rodriguez',
    email: 'jrodriguez@email.com',
    phone: '+34 600 123 456',
    programme: 'Barcelona Residency',
  },
]

// Helper function to find contact by phone or email
export function findContactByPhoneOrEmail(phoneOrEmail: string): typeof mockContacts[0] | null {
  const normalized = phoneOrEmail.replace(/\s+/g, '').toLowerCase()

  return mockContacts.find(contact => {
    const contactPhone = contact.phone.replace(/\s+/g, '').toLowerCase()
    const contactEmail = contact.email.toLowerCase()

    return contactPhone === normalized || contactEmail === normalized
  }) || null
}