import AutoAdvanceProps from '@/features/post/ui/autoAdvanceProps';

export type AutoAdvanceNotEnabled = {
  type: 'NotEnabled';
};

export type AutoAdvanceEnabled = {
  type: 'Enabled';
  interval: number;
};

export type AutoAdvance = AutoAdvanceNotEnabled | AutoAdvanceEnabled;

export function toProps(autoAdvance: AutoAdvance): AutoAdvanceProps {
  return {
    isAutoAdvanceEnabled: autoAdvance.type === 'Enabled',
    autoAdvanceInterval:
      autoAdvance.type === 'Enabled' ? autoAdvance.interval : undefined,
  };
}
