/**
 * Generates a WhatsApp deep link.
 * @param {string} phone - The phone number (with or without country code).
 * @param {string} message - The pre-filled message.
 * @returns {string} The WhatsApp deep link URL.
 */
export const createWhatsAppLink = (phone, message) => {
    if (!phone) return '#';

    // Remove all non-numeric characters for the phone number
    const cleanPhone = phone.replace(/\D/g, '');

    // Encode the message
    const encodedMessage = encodeURIComponent(message || '');

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Generates a pre-filled task assignment message.
 * @param {object} task - The task object.
 * @param {string} workerName - The name of the worker.
 * @returns {string} The formatted message.
 */
export const getTaskAssignmentMessage = (task, workerName) => {
    return `Hi ${workerName || 'Team'},
I've assigned you a new task: *${task.title}*
📅 Due: ${task.dueDate || 'ASAP'}
📍 Location: ${task.location || 'N/A'}
📝 Details: ${task.description || ''}

Please reply with a photo when done.`;
};
