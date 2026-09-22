import { api, money } from './api';
export function makeActions(open) {
  return {
    batchForm: () =>
      open({
        title: 'Give surplus a next chapter',
        description:
          'New food batches require a documented quality review before they can be reserved.',
        submit: 'Create batch',
        fields: [
          { name: 'name', label: 'Food / batch name', placeholder: 'e.g. Vegetable pulao' },
          {
            name: 'category',
            label: 'Category',
            options: ['Cooked meals', 'Produce', 'Bakery', 'Dairy', 'Grains', 'Ingredients'],
          },
          { name: 'quantity', label: 'Quantity (kg)', type: 'number', min: 0.1, max: 10000 },
          { name: 'expiresAt', label: 'Use-by date & time', type: 'datetime-local' },
          {
            name: 'storage',
            label: 'Storage condition',
            options: ['Hot held', 'Chilled', 'Ambient', 'Frozen'],
          },
          {
            name: 'channel',
            label: 'Recovery channel',
            options: [
              { value: 'donation', label: 'Donate to community' },
              { value: 'sale', label: 'Sell to secondary buyer' },
            ],
          },
          {
            name: 'price',
            label: 'Sale price / kg (₹); 0 for donation',
            type: 'number',
            value: 0,
            min: 0,
          },
          {
            name: 'allergens',
            label: 'Allergens (comma separated)',
            placeholder: 'Milk, wheat',
            required: false,
          },
        ],
        save: (v) =>
          api('/batches', {
            method: 'POST',
            body: {
              ...v,
              expiresAt: new Date(v.expiresAt).toISOString(),
              allergens: v.allergens
                .split(',')
                .map((x) => x.trim())
                .filter(Boolean),
            },
          }),
      }),
    reviewBatch: (b) =>
      open({
        title: `Review ${b.name}`,
        description:
          'A trained operator must check handling records, packaging, allergens, time and temperature. AI does not authorize release.',
        submit: 'Record quality decision',
        fields: [
          {
            name: 'decision',
            label: 'Decision',
            options: [
              { value: 'hold', label: 'Hold for further inspection' },
              { value: 'release', label: 'Release for redistribution' },
            ],
          },
          {
            name: 'note',
            label: 'Inspection evidence',
            type: 'textarea',
            minLength: 12,
            placeholder: 'Record time, temperature, packaging and reviewer observations.',
          },
        ],
        save: (v) => api(`/batches/${b._id}/review`, { method: 'POST', body: v }),
      }),
    claim: (b) =>
      open({
        title: `Reserve ${b.name}`,
        description: `Reserve all ${b.quantity} kg from ${b.org}. ${b.channel === 'sale' ? `Order value: ${money(b.quantity * b.price)}; platform fee: ${money(b.quantity * b.price * 0.04)}. Pilot reservation only; no payment is collected.` : 'Food is donated with no NGO platform fee.'} Confirm your capacity and allergen suitability.`,
        submit: 'Confirm reservation',
        fields: [
          {
            name: 'ack',
            label: 'Receiving readiness',
            options: ['Capacity, storage and allergen requirements checked'],
          },
        ],
        save: () => api(`/batches/${b._id}/claim`, { method: 'POST' }),
      }),
    transition: (b, status) =>
      open({
        title:
          status === 'confirmed'
            ? 'Confirm receipt'
            : status === 'delivered'
              ? 'Record delivery'
              : 'Record pickup',
        description: `${b.name} · ${b.quantity} kg. Verify quantity, package condition and handling before proceeding.`,
        submit: status === 'confirmed' ? 'Confirm received' : 'Save handover',
        fields: [
          {
            name: 'proof',
            label: 'Handover evidence / reference',
            type: 'textarea',
            minLength: 8,
            placeholder: 'Quantity received, recipient reference, time and condition…',
          },
        ],
        save: (v) =>
          api(`/batches/${b._id}/transition`, { method: 'POST', body: { ...v, status } }),
      }),
    dispatch: (b) =>
      open({
        title: 'Accept recovery job',
        description: `Transport ${b.quantity} kg of ${b.name} from ${b.org} to ${b.claimant?.org}. Delivery must finish before the use-by time.`,
        fields: [
          {
            name: 'ready',
            label: 'Vehicle check',
            options: ['Vehicle capacity and food handling checked'],
          },
        ],
        submit: 'Accept job',
        save: () => api(`/batches/${b._id}/dispatch`, { method: 'POST' }),
      }),
    sponsor: (b) =>
      open({
        title: 'Sponsor this food journey',
        description: `Fund transport for ${b.quantity} kg of ${b.name}. This is a recorded pilot pledge, not a payment. Impact is counted after recipient confirmation.`,
        fields: [
          {
            name: 'amount',
            label: 'Transport pledge (₹)',
            type: 'number',
            min: 1,
            max: 10000,
            value: 450,
          },
        ],
        submit: 'Record pledge',
        save: (v) => api(`/batches/${b._id}/sponsor`, { method: 'POST', body: v }),
      }),
    need: () =>
      open({
        title: 'Post a community need',
        fields: [
          { name: 'quantity', label: 'Required food (kg)', type: 'number', min: 1 },
          {
            name: 'category',
            label: 'Food category',
            options: ['Cooked meals', 'Produce', 'Bakery', 'Grains'],
          },
          { name: 'note', label: 'Service and dietary requirements', type: 'textarea' },
        ],
        save: (v) => api('/needs', { method: 'POST', body: v }),
      }),
  };
}
