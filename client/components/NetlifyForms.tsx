import React from "react";

/**
 * Hidden HTML forms for Netlify form detection.
 * These forms are required for JavaScript-rendered forms to be detected by Netlify's build system.
 * They should match the structure of the actual forms used in the application.
 */
export function NetlifyForms() {
  return (
    <div style={{ display: "none" }}>
      {/* Egg Collection Form */}
      <form name="egg-collection" data-netlify="true">
        <input type="hidden" name="form-name" value="egg-collection" />
        <input type="text" name="collection-date" />
        <input type="number" name="grams" />
        <textarea name="notes"></textarea>
      </form>

      {/* Weekly Goal Form */}
      <form name="weekly-goal" data-netlify="true">
        <input type="hidden" name="form-name" value="weekly-goal" />
        <input type="number" name="goal" />
      </form>

      {/* Contact/Feedback Form (optional for future use) */}
      <form name="contact" data-netlify="true">
        <input type="hidden" name="form-name" value="contact" />
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message"></textarea>
      </form>
    </div>
  );
}
