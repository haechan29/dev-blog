export interface InquiryReadyImageProps {
  status: 'ready';
  clientId: string;
  id: string;
  url: string;
}

export interface InquiryUploadingImageProps {
  status: 'uploading';
  file: File;
  clientId: string;
  previewUrl: string;
}

export interface InquiryErrorImageProps {
  status: 'error';
  clientId: string;
  previewUrl: string;
}

export type InquiryImageProps =
  | InquiryReadyImageProps
  | InquiryUploadingImageProps
  | InquiryErrorImageProps;
