function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

function getErrorResponse(message, errors) {
  const body = { ok: false, message };
  if (errors) body.errors = errors;
  return body;
}

const MAX_LENGTH = 500;

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return sendJson(res, 405, getErrorResponse('Method not allowed'));
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return sendJson(res, 500, getErrorResponse('The contact form is not configured correctly.'));
    }

    let body;
    try {
      body = typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
    } catch {
      return sendJson(res, 400, getErrorResponse('Invalid request format.'));
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
      return sendJson(res, 400, getErrorResponse('Please check the required fields and try again.', errors));
    }

    const { createClient } = await import('@supabase/supabase-js');
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
      return sendJson(res, 500, getErrorResponse('Something went wrong. Please try again or contact us directly.'));
    }

    sendJson(res, 200, { ok: true, message: "Thanks! Your request has been received. We'll contact you soon." });
  } catch {
    sendJson(res, 500, getErrorResponse('Something went wrong. Please try again or contact us directly.'));
  }
}
