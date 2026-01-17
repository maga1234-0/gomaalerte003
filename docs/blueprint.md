# **App Name**: Goma Alert

## Core Features:

- Incident Reporting: Allow users to submit incident reports with title, description, category, and location.
- Alert Feed: Display verified alerts in a timeline view, filterable by category and location.
- Admin Dashboard: Provide an admin interface to view, approve, reject, and manage incident reports, with Firebase Authentication.
- Alert Verification Tool: Use a tool to analyze pending reports to identify fake or duplicate submissions, using keyword analysis and source credibility assessment, alerting the admin.
- WhatsApp Sharing: Enable sharing alerts via WhatsApp link with an "Open WhatsApp" button for urgent alerts.
- Firestore Integration: Use Firestore to store alerts and user data with real-time updates and Firebase Security Rules for data protection.

## Style Guidelines:

- Primary color: Deep blue (#1A237E) to inspire trust and security in the information provided. The selection of blue is related to the idea of verified information.
- Background color: Light blue-gray (#ECEFF1) for a clean, low-distraction background.
- Accent color: Teal (#26A69A) for interactive elements, providing a complementary color that enhances readability without overwhelming the user.
- Headline font: 'Poppins' (sans-serif) for a contemporary, precise feel in headings and titles. Body font: 'PT Sans' (sans-serif) for body text and longer descriptions, ensuring readability across devices.
- Use clear, modern icons to represent incident categories, making it easy to scan and filter alerts. Consider icons that are easily recognizable even with limited internet bandwidth.
- Mobile-first, single-column layout for easy content consumption on all devices. Prioritize essential information and make key actions easily accessible.
- Use minimal animations for key interactions to provide feedback without consuming bandwidth, such as loading indicators or subtle transitions when filtering alerts.