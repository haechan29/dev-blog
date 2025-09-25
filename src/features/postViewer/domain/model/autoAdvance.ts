import AutoAdvanceProps from '@/features/postViewer/ui/autoAdvanceProps';

export type AutoAdvanceDisabled = {
  type: 'Disabled';
};

export type AutoAdvanceEnabled = {
  type: 'Enabled';
  interval: number;
};

export type AutoAdvance = AutoAdvanceDisabled | AutoAdvanceEnabled;

export function toProps(autoAdvance: AutoAdvance): AutoAdvanceProps {
  return {
    isAutoAdvanceEnabled: autoAdvance.type === 'Enabled',
    autoAdvanceInterval:
      autoAdvance.type === 'Enabled' ? autoAdvance.interval : undefined,
  };
}
