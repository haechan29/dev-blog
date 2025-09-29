export type DisabledTTSProps = {
  mode: 'disabled';
};

export type EnabledTTSProps = {
  mode: 'enabled';
  isPlaying: boolean;
  elementIndex: number;
};

export type TTSProps = DisabledTTSProps | EnabledTTSProps;
