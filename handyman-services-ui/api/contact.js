import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function error(status, message, errors) {
  const body = { ok: false, message };
  if (errors) body.errors = errors;
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function success(message) {
  return new Response(JSON.stringify({ ok: true, message }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

const MAX_LENGTH = 500;

export async function handler(request) {
  if (request.method !== 'POST') {
    return error(405, 'Method not allowed');
  }

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return error(500, 'Something went wrong. Please try again or contact us directly.');
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return error(400, 'Invalid request format.');
  }

  const trim = (v) => (typeof v === 'string' ? v.trim() : '');

  const name = trim(body.name);
  const phone = trim(body.phone);
  const email = trim(body.email);
  const service = trim(body.service);
  const propertyType = trim(body.propertyType || '');
  const preferredTiming = trim(body.preferredTiming || '');
  const message = trim(body.message);

  const errors = {};

  if (!name) errors.name = 'Enter your full name.';
  if (!phone) errors.phone = 'Enter your phone number.';
  if (!email) errors.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = 'Enter a valid email address.';
  if (!service) errors.service = 'Select a service.';
  if (!message) errors.message = 'Enter a brief message.';

  if (name.length > 200) errors.name = 'Name is too long.';
  if (phone.length > 50) errors.phone = 'Phone number is too long.';
  if (email.length > 200) errors.email = 'Email is too long.';
  if (service.length > 200) errors.service = 'Service selection is too long.';
  if (propertyType.length > 100) errors.propertyType = 'Property type is too long.';
  if (preferredTiming.length > 100) errors.preferredTiming = 'Timing selection is too long.';
  if (message.length > MAX_LENGTH) errors.message = 'Message is too long.';

  if (Object.keys(errors).length > 0) {
    return error(400, 'Please check the required fields and try again.', errors);
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { error: insertError } = await supabase
      .from('contact_submissions')
      .insert({
        full_name: name,
        phone,
        email,
        service_needed: service,
        property_type: propertyType,
        preferred_timing: preferredTiming,
        message,
        source: 'website',
        status: 'new',
      });

    if (insertError) {
      return error(500, 'Something went wrong. Please try again or contact us directly.');
    }

    return success("Thanks! Your request has been received. We'll contact you soon.");
  } catch {
    return error(500, 'Something went wrong. Please try again or contact us directly.');
  }
}
