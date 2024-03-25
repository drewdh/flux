const widgetDetails: Record<string, WidgetDetail> = {
  diablo: {
    description:
      'View player statistics and find which Diablo IV Nightmare Dungeon Sigil Tier to use.',
    title: 'Diablo IV',
  },
  coffee: {
    title: 'Pourover calculator',
    description: 'TBD',
  },
  ecobee: {
    title: 'Ecobee dashboard',
    description: 'A dashboard for viewing statistics for an Ecobee thermostat.',
  },
  feedback: {
    title: 'Admin dashboard',
    description: 'A dashboard for viewing site feedback. Requires an administrator account.',
  },
  twitch: {
    title: 'Twitch',
    description: 'A re-imagined Twitch experience.',
  },
};

interface WidgetDetail {
  description: string;
  title: string;
}

export default widgetDetails;
