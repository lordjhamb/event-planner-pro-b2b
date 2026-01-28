/**
 * Email Service
 * Handles sending emails for the application.
 * Currently supported providers:
 * - 'mailto': Opens user's default email client (Zero config)
 * - 'console': Logs email to console (Development)
 */

export const sendInvitationEmail = async ({ to, name, inviteLink, organizationName }) => {
    try {
        const subject = `You're invited to join ${organizationName}`;
        const body = `Hello ${name},\n\nYou have been invited to join the team at ${organizationName}.\n\nClick the link below to accept your invitation and get started:\n${inviteLink}\n\nBest regards,\nThe Team`;

        // Construct mailto link
        const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // Open default mail client
        window.open(mailtoLink, '_blank');

        console.log(`[EmailService] Opened mail client for ${to}`);
        return { success: true };
    } catch (error) {
        console.error("[EmailService] Failed to open mail client:", error);
        return { success: false, error };
    }
};
