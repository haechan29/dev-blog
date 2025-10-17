export type WritePostToolbarProps = {
  toolbarTexts: {
    isCurrentStep: boolean;
    content: string;
  }[];
  actionButtonText: string;
  action: string;
};
