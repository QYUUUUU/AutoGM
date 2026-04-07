/**
 * @fileoverview globals.js
 * @description Stores global execution instance states, such as overriding the application global `userId`. 
 * 
 * Wait for obsolete code confirmation:
 * Mutating state globally across a Node.js Express server is dangerous for stateless architectures. 
 * If multiple users visit the service concurrently, `userId` will overwrite itself globally.
 * Use `req.session.userId` exclusively!
 */

let userId = "";

/**
 * Sets a globally exported temporary memory `userId` variable across executions.
 * @param {string|number} id 
 */
export function setUserId(id) {
  userId = id;
}

/**
 * Gets the temporarily set global execution override for `userId`.
 * @returns {string|number}
 */
export function getUserId() {
  return userId;
}
}