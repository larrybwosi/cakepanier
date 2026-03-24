'use server';

import { createDealioCustomer, findCustomerByEmail } from './customers';
import { createDealioOrder } from './orders';
import { DealioOrderCreatePayload } from './types';

export async function submitCakesInquiry(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const occasion = formData.get('occasion') as string;
  const dateNeeded = formData.get('dateNeeded') as string;
  const guests = formData.get('guests') as string;
  const notes = formData.get('notes') as string;

  if (!name || !email) {
    return { success: false, error: 'Name and email are required.' };
  }

  try {
    // 1. Sync or find customer
    let customer = await findCustomerByEmail(email);
    if (!customer) {
      const [firstName, ...lastNameParts] = name.split(' ');
      customer = await createDealioCustomer({
        firstName: firstName || 'Guest',
        lastName: lastNameParts.join(' ') || 'Customer',
        email,
        customerType: 'retail',
      });
    }

    // 2. Create a "Special Order" or inquiry representation as an order
    // Since there's no specific "inquiry" endpoint, we use the orders API
    // with a placeholder item or just notes if the API allows.
    // If it requires items, we might need a "Custom Cake Inquiry" product ID.

    const inquiryNotes = `
      CAKE INQUIRY:
      Occasion: ${occasion}
      Date Needed: ${dateNeeded}
      Guest Count: ${guests}
      Additional Notes: ${notes}
    `.trim();

    const orderPayload: DealioOrderCreatePayload = {
      externalOrderId: `INQ-${Date.now()}`,
      locationId: 'default', // Assuming a default location exists or is required
      customerId: customer.id,
      items: [], // Some APIs might require at least one item, but we'll try empty first
      notes: inquiryNotes,
      channel: 'ECOMMERCE_STORE',
    };

    // Note: If createDealioOrder fails because items is empty, we would need to add a generic inquiry item.
    const result = await createDealioOrder(orderPayload);

    return { success: true, orderId: result.id };
  } catch (error: any) {
    console.error('Failed to submit inquiry:', error);
    return { success: false, error: error.message || 'Failed to submit inquiry. Please try again later.' };
  }
}
