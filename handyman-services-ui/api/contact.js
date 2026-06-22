import { createClient } from "@supabase/supabase-js";

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function cleanString(value, maxLength = 1000) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getRequestBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendJson(res, 405, {
      ok: false,
      message: "Method not allowed.",
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return sendJson(res, 500, {
      ok: false,
      message: "The contact form is not configured correctly.",
    });
  }

  const body = getRequestBody(req);

  const payload = {
    name: cleanString(body.name, 120),
    phone: cleanString(body.phone, 60),
    email: cleanString(body.email, 160),
    service: cleanString(body.service, 160),
    propertyType: cleanString(body.propertyType, 120),
    preferredTiming: cleanString(body.preferredTiming, 120),
    message: cleanString(body.message, 2000),
  };

  const errors = {};

  if (!payload.name) {
    errors.name = "Enter your full name.";
  }

  if (!payload.phone) {
    errors.phone = "Enter your phone number.";
  }

  if (!payload.email || !isValidEmail(payload.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!payload.service) {
    errors.service = "Select or enter the service needed.";
  }

  if (!payload.message) {
    errors.message = "Enter a short message about the project.";
  }

  if (Object.keys(errors).length > 0) {
    return sendJson(res, 400, {
      ok: false,
      message: "Please check the required fields and try again.",
      errors,
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { error } = await supabase.from("contact_submissions").insert({
      full_name: payload.name,
      phone: payload.phone,
      email: payload.email,
      service_needed: payload.service,
      property_type: payload.propertyType || null,
      preferred_timing: payload.preferredTiming || null,
      message: payload.message,
      source: "website",
      status: "new",
    });

    if (error) {
      console.error("Supabase contact insert failed:", error.message);
      return sendJson(res, 500, {
        ok: false,
        message: "Something went wrong. Please try again or contact us directly.",
      });
    }

    return sendJson(res, 200, {
      ok: true,
      message: "Thanks! Your request has been received. We'll contact you soon.",
    });
  } catch (error) {
    console.error("Contact API failed.");
    return sendJson(res, 500, {
      ok: false,
      message: "Something went wrong. Please try again or contact us directly.",
    });
  }
}
